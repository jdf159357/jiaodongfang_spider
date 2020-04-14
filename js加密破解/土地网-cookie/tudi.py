# -*- coding: utf-8 -*-
import requests

url = "http://www.landchina.com/default.aspx?tabid=226"
response = requests.get(url)
print(response.status_code)
print(response.text)
