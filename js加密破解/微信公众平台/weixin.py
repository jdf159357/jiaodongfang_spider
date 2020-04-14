import execjs

with open('./weixin_login.js') as f:  # 执行 JS 文件
    ctx = execjs.compile(f.read())

print(ctx.call('getpwd', '666666'))