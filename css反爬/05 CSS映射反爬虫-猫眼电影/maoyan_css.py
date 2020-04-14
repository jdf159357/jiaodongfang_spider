# https://blog.csdn.net/yangbaba__/article/details/104980564

import requests
from fontTools.ttLib import TTFont
import re


def analys(a, b):
    # 判断参考码和验证码是否统一
    found = False
    n = 0
    if abs(len(a) - len(b)) >= 5 :
        return found
    for i in range(min(len(a),len(b))):
        if abs(a[i][0] - b[i][0]) <=30 or abs(a[i][1] - b[i][1]) <= 30:
            n += 1
    x = abs(len(b)-len(a))
    for i in range(min(len(a),len(b)),x+max(len(a),len(b))):
        if len(a) == len(b):
            break
        elif len(a) > len(b):
            if abs(a[i-x][0] - b[i-2*x][0]) <= 10 or abs(a[i-x][1] - b[i-2*x][1]) <= 10:
                n += 1
        elif len(a) < len(b):
            if abs(a[i-2*x][0] - b[i-x][0]) <= 10 or abs(a[i-2*x][1] - b[i-x][1]) <= 10:
                n += 1

    if n >= min(len(a),len(b)) * 0.30:
        found = True
        return found
    else:
        return found


def find_secret_type(res):
    # 查找加密字体源文件并下载
    woff = re.findall(r'//vfile.*?woff', res)[0]
    woff_url = 'http:' + woff
    woff_resp = requests.get(woff_url, headers=headers).content
    with open('movie.woff', 'wb') as fi:
        fi.write(woff_resp)
    # 打开参考文件和要翻译的文件
    trans_file = TTFont('movie.woff')
    refer_file = TTFont('maoyan.woff')
    # 打开参考和翻译的Unicode列表，以及参考表Unicode对应的数字
    trans_file_list = trans_file.getGlyphOrder()[1:]
    refer_file_list = refer_file.getGlyphOrder()[1:]
    shuzi = ['', '2', '5', '7', '4', '8', '3', '0', '1', '9', '6']
    # 编写源代码中的16进制乱码与Unicode的映射关系，翻译组：trans_tump为十进制数字和Unicode之间的映射关系，real_tump为十六进制乱码和Unicode之间的
    # 映射关系
    trans_tump = trans_file.getBestCmap()
    real_tump = {}
    trans_dict = {}
    for i, j in trans_tump.items():
        real_tump['&#' + hex(i)[1:]] = j
    # 寻找参考组和翻译组间的对应关系并用trans_dict字典联系起来，其中字典内容为翻译的数字和Unicode之间的映射关系
    for trans_file_element in trans_file_list:  # 对翻译组的Unicode进行循环
        coordinate = trans_file['glyf'][trans_file_element].coordinates  # 坐标
        for i, refer_file_element in enumerate(refer_file_list):  # 对参考组的数据进行迭代
            refer_co = refer_file['glyf'][refer_file_element].coordinates
            if analys(coordinate, refer_co):
                trans_dict[trans_file_element] = shuzi[i]
                break
    # 将该页要翻译的16进制乱码与正确的数字之间的映射关系建立起来
    real_dict = {}
    for i, j in real_tump.items():
        for k, u in trans_dict.items():
            if j == k:
                real_dict[i] = u
    return real_dict


if __name__ == '__main__':
    url = 'https://maoyan.com/films/1218029'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
    }
    res = requests.get(url=url, headers=headers).text

    real_dict = find_secret_type(res)  # 破解加密字体，获得映射关系字典

    for k, u in real_dict.items():  # 将加密字体全部替换掉
        res = res.replace(k + ';', u)

    result = re.findall('<span class="stonefont">(.+?)</span>', res)
    print(result)