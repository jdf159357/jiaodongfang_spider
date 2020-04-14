# -*- coding: utf-8 -*-

# 混淆前js
js = """
var arr = ["Date", "getTime"];
console.log(window[arr[0]]()[arr[1]])
"""

import re

# 1.正则匹配出列表
js_arr_name = 'arr'  # 混淆js中数组定义的名称
arr = eval(re.findall(js_arr_name + ' = (\[[\s\S]+?\])', js)[0])

# 2.正则匹配出所有需要替换的数组引用
be_replaced_arr_set = set(re.findall(js_arr_name + '\[\d+\]', js))

# 3.循环遍历进行替换
for be_replaced_arr in be_replaced_arr_set:
    res = eval(be_replaced_arr)
    js = js.replace(be_replaced_arr, '"' + res + '"')
    print('{} 替换完成'.format(res))

print('解混淆后：\n', js)