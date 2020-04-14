import io
import requests
try:
    from PIL import Image
except:
    import Image
import pytesseract



headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
}

url = 'https://vip.gxrc.com/Public/Phone/0F555FA2-D465-435E-9A94-1FACA77FD9C0'

resp = requests.get(url=url, headers=headers)
with open('pic.png', 'wb') as f:
    f.write(resp.content)
image_stream = Image.open(io.BytesIO(resp.content))
print(pytesseract.image_to_string(image_stream))