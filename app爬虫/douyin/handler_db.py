# MONGO 数据库配置


from pymongo import MongoClient

M_DATABASE = "douyin"  # 数据库
M_HOST = "localhost"  # 地址
M_PORT = 27017  # 端口
M_USER = ""  # 用户名
M_PASSWORD = ""  # 密码


if M_USER and M_PASSWORD:
    uri = 'mongodb://{}:{}@{}:{}'.format(M_USER, M_PASSWORD, M_HOST, str(M_PORT))
    client = MongoClient(uri)
else:
    client = MongoClient(host=M_HOST, port=M_PORT)
db = client[M_DATABASE]
col = db['user_id']
col.ensure_index('share_id', unique=True)

def save_data(item):
    try:
        col.insert(item)
    except:
        pass