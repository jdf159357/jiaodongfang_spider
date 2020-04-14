import execjs

with open('./my_md5.js') as f:  # 执行 JS 文件
    ctx = execjs.compile(f.read())

print(ctx.call('md5', '6666666666'))

with open('./my_encrpt.js') as f:  # 执行 JS 文件
    ctx = execjs.compile(f.read())

print(ctx.call('getpwd'))