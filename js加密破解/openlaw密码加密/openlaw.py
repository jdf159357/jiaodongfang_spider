import execjs

with open('my.js', encoding='utf-8') as f:  # 执行 JS 文件
    ctx = execjs.compile(f.read())

print(ctx.call('keyEncrypt', 'a12345678'))