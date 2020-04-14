import requests
import execjs
import re

# 1.定义session对象
s = requests.session()
s.headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
}

# 2.第一次访问页面, 获取响应(里面有对应 __jsl_clearance生成的逻辑)
url = 'http://www.gsxt.gov.cn/index.html'
res = s.get(url=url)

# 3.获取响应js中具体执行的代码(在eval中)
js = re.findall('<script>(.+?)</script>', res.text)[0]
js = js.replace('{eval(', '{code=(')
ctx = execjs.compile(js)
code = ctx.eval('code')

# 4.正则匹配出__jsl_clearance生成的代码
cookie_code = re.findall("document.(cookie=.+)\+';Expires", code)[0]
# 方法一：因代码中包含document对象, 无法直接在node.js中直接运行, 可以注入一段客户端js
client_code = """
var window = this;
var document = {};
document.createElement = function(tag){
	return {firstChild:{href: 'http://www.gsxt.gov.cn/'}};
}
"""
ctx = execjs.compile(client_code + cookie_code)
__jsl_clearance = ctx.eval('cookie')

# # 方法二：正则替换var _2x=document.createElement('div');_2x.innerHTML='<a href=\'/\'>_h</a>';_2x=_2x.firstChild.href;
# cookie_code = re.sub(r"var\s+(\w+)=document.createElement\('\w+'\);\w+.innerHTML='<a href=\\'/\\'>\w+</a>';\w+=\w+.firstChild.href;", r"var \1='http://www.gsxt.gov.cn/';", cookie_code)
# ctx = execjs.compile(cookie_code)
# __jsl_clearance = ctx.eval('cookie')

# 5.将__jsl_clearance添加到session中
s.cookies.set(__jsl_clearance.split('=')[0], __jsl_clearance.split('=')[1])

# 6.第二次访问页面, 获取结果
res = s.get(url=url)

# 7.获取最终的cookie
cookie_dict = requests.utils.dict_from_cookiejar(s.cookies)
print(cookie_dict)