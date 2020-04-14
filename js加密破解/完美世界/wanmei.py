import execjs

with open('./my.js', encoding='utf8') as f:  # 执行 JS 文件
    ctx = execjs.compile(f.read())

print(ctx.call('getpwd', '666666'))
