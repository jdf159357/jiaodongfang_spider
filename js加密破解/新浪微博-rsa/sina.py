import execjs

with open('./user.js') as f:  # 执行 JS 文件
    ctx = execjs.compile(f.read())

print(ctx.call('getUser', '15151756112'))