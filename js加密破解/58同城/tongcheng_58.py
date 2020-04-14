# -*- coding：utf-8 -*-

import execjs

with open('./my.js', encoding='UTF-8') as f:  # 执行 JS 文件
    ctx = execjs.compile(f.read())

print(ctx.call('encryptString', '1411093327735666666', '010001', '008baf14121377fc76eaf7794b8a8af17085628c3590df47e6534574efcfd81ef8635fcdc67d141c15f51649a89533df0db839331e30b8f8e4440ebf7ccbcc494f4ba18e9f492534b8aafc1b1057429ac851d3d9eb66e86fce1b04527c7b95a2431b07ea277cde2365876e2733325df04389a9d891c5d36b7bc752140db74cb69f'))