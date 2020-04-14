import io
import requests
try:
    from PIL import Image
except:
    import Image
import pytesseract


for i in range(20):
    print(i)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
    }

    url = 'http://zxgk.court.gov.cn/shixin/captchaNew.do?captchaId=y2uMorOf1lR0l88kbmCnd3e8OMfvlnOU&random=0.3669243396297148'

    resp = requests.get(url=url, headers=headers)

    image_stream = Image.open(io.BytesIO(resp.content))
    print(pytesseract.image_to_string(image_stream))