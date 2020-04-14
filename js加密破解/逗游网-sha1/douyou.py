# -*- coding：utf-8 -*-

# import execjs
#
# with open('./jsencrypt.js', encoding='UTF-8') as f:  # 执行 JS 文件
#     ctx = execjs.compile(f.read())
#
# print(ctx.call('getpwd', '66666'))

import js2py

context = js2py.EvalJs()

with open("my.js", 'r', encoding='utf8') as f:
    context.execute(f.read())

print(context.getpwd('666666'))