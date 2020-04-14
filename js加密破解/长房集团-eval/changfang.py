import execjs

with open('./my.js') as f:  # 执行 JS 文件
    ctx = execjs.compile(f.read())

print(ctx.call('desEncrypt', '666666', 'E0C4C427235A0D4060395D106317D6B8'))
