import requests

url = 'http://openlaw.cn/judgement/d2a0c4bf32c3463bb3d3bb3e68a04be7?keyword='
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
    'Cookie': 'SESSION=NGYyMDFlMmUtMWNmNy00MDE3LWJhYjMtZjVlZTgyMjU5ODJj; Hm_lvt_a105f5952beb915ade56722dc85adf05=1584850409; Hm_lpvt_a105f5952beb915ade56722dc85adf05=1584850634'
}

resp = requests.get(url, headers=headers)
print(resp.status_code)

with open('detail.html', 'w') as f:
    f.write(resp.text)