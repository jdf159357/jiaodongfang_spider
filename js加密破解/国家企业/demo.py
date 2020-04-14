import requests
from pprint import pprint

url = 'http://www.gsxt.gov.cn/affiche-query-area-info-paperall.html?noticeType=11&areaid=100000&noticeTitle=&regOrg=110000'

data = {
    'draw': 1,
    'start': 0,
    'length': 10
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
    'Cookie': '__jsluid_h=af3fa14f3e25f4c58585834897b5c772; '
              '__jsl_clearance=1584705297.807|0|7JiXE1Kh68NKAXYE3CEkUmdIb4c%3D;',
}

res = requests.post(url=url, headers=headers, data=data)

pprint(res.content.decode())