# https://blog.csdn.net/weixin_43752839/article/details/100055264

import requests
from lxml import etree
import re
import js2py  # 运行js的库


def seedRequest(url, header):  # 发送请求，返回响应内容
    response = requests.get(url=url, headers=header)
    response.encoding = response.apparent_encoding
    # response.encoding = "utf8"
    print(response.status_code)
    return response.text


def createJs(response):  # 将响应内容的js内容写入文件，并删除修改部分内容
    jsText = re.findall('<script type="text/javascript">.*?(var CryptoJS.*?)</script>', response, flags=re.S)[0]
    jsText = re.sub('(for\(var i=0x0;i<words.*?document.*?\}\})', "", jsText, flags=re.S)
    jsText = re.sub('var n=document.*?\(n\);\}', "", jsText, flags=re.S)
    jsText = re.sub('if\(top\[.*?\];\}', "", jsText, flags=re.S)
    jsText = re.sub('typeof document', "'object'", jsText, flags=re.S)
    # with open("./createJs.js","w",encoding="utf8") as fm:
    #     fm.write("function parseWord(){" + jsText + "return words;}")
    return "function parseWord(){" + jsText + "return words;}"


def get_words_js(js):  # 运行js代码，返回words列表
    # with open("./createJs.js","r",encoding="utf8") as fp:
    #     js = fp.read()
    data = js2py.eval_js(js)
    return data()


def func(obj):  # re.sub中调用的函数，将匹配的内容进行处理，并返回相对应的汉字
    span = obj.group(0)
    num = re.findall('context_kw(\d+)', span, re.I)[0]
    try:
        replace = words[int(num)]
        return replace
    except KeyError:
        print("未找到编号%s的汉字" % num)
        return "#"


def htmlReplace(html):  # 正则匹配到span标签并替换成对应汉字
    responseReplace = re.sub('<span class="context_kw\d*?"></span>', func, html)
    return responseReplace


def getContentHtml(response):  # 解析页面，获取小说内容
    tree = etree.HTML(response)
    title = tree.xpath("//div[@class='lf']/h1/text()")[0]
    text = tree.xpath("///div[@class='rdtext']/p/text()")
    concatText = "".join(text)
    print(title)
    print(text)


if __name__ == '__main__':
    header = {
        "authority": "g.hongshu.com",
        "method": "GET",
        "path": "/content/93416/13877912.html",
        "scheme": "https",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        # "cookie": "pgv_pvi=7004054528; bookfav=%7B%22b93416%22%3A0%7D; pgv_si=s2563727360; Hm_lvt_e966b218bafd5e76f0872a21b1474006=1566288274,1566295321,1566460817; Hm_lpvt_e966b218bafd5e76f0872a21b1474006=1566460817; yqksid=u5j08hk2dgmrtj0hirfv0niss2",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
    }
    url = "https://g.hongshu.com/content/93416/13901181.html"
    # words = ["，","的","。","刘","人","一","他","是","不","在","有","了","着","”","“","秀","大","上","道","歆","个","名","下","地"]

    html = seedRequest(url, header)
    words = get_words_js(createJs(html))
    getContentHtml(htmlReplace(html))