# -*- coding: utf-8 -*-

import re
import execjs

# 1.编译解函数到node.js环境中
js_func_name = '_0xea12'  # 混淆js中函数定义的名称
with open('func.js') as f:  # 执行 JS 文件
    ctx = execjs.compile(f.read())

# 2.正则匹配出所有需要替换的函数
with open('混淆.js') as f1:
    js = f1.read()
be_replaced_func_set = set(re.findall(js_func_name + "\([\s\S]+?\)", js))

# 3.循环遍历进行替换
for be_replaced_func in be_replaced_func_set:
    args_tuple = re.findall("\(([\s\S]+?)\)", be_replaced_func)[0]
    args0 = eval(args_tuple.split(',')[0])

    res = ctx.call(js_func_name, args0)
    js = js.replace(be_replaced_func, "'" + res + "'")
    print('{} 替换完成'.format(res))

with open('解混淆后.js', 'w') as f2:
    js = f2.write(js)