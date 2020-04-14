# -*- coding: utf-8 -*-
import hashlib
import binascii
import scrapy
import json
import base64
import redis
import time
# from mkvideo.settings import REDIS_URL,redis_table
import random


headers = {
    'Host':'api-eagle.amemv.com',
    'Connection':'keep-alive',
    'Cookie':'tt_webid=6759040097481623054; _ba=BA0.2-20191114-5199e-rUeTDmKxloA8nzJExuRA',
    'Accept-Encoding':'gzip',
    'X-SS-REQ-TICKET':'1548663421199',
    'X-Gorgon': '03006cc0000046173b2fa76ab9aa72ebe6c47b81af954a78a705',
    'X-Khronos': '1548663421',
    'X-Pods':'',
    'User-Agent':'com.ss.android.ugc.aweme/431 (Linux; U; Android 8.0.0; zh_CN; MI 6; Build/OPR1.170623.027; Cronet/58.0.2991.0)',
}

class MeipaiSpider(scrapy.Spider):
    name = 'douyin'
    # server = redis.from_url(REDIS_URL)
    # table = redis_table
    def start_requests(self):
        url = 'https://api-eagle.amemv.com/aweme/v1/feed/?type=0&max_cursor=0&min_cursor=-1&count=6&volume=0.0&pull_type=2&need_relieve_aweme=0&filter_warn=0&req_from&is_cold_start=0&longitude=0&latitude=0&ts=1548663421&js_sdk_version=1.6.4&app_type=normal&manifest_version_code=431&_rticket=1548663421201&ac=wifi&device_id=55014179296&iid=59857683283&mcc_mnc=46000&os_version=8.0.0&channel=xiaomi&version_code=431&device_type=MI%206&language=zh&uuid=865873035293665&resolution=1080*1920&openudid=5ffc9afec479e790&update_version_code=4312&app_name=aweme&version_name=4.3.1&os_api=26&device_brand=Xiaomi&ssmix=a&device_platform=android&dpi=480&aid=1128&as=a1652bd4cd77cc8a2e8866&cp=b274c751deef4fade1]oKw&mas=014ad2496b5b39e4e20159878f14f662396c6c1c1ca64c861cc6c6'
        yield scrapy.Request(url, method='GET',  headers=headers)

    def parse(self, response):
        print(response.text)
        res_list = json.loads(response.text).get('aweme_list')
        for res in res_list:
            item = {}
            item['source'] = 10
            if res.get('raw_ad_data'): #去掉接口中的广告
                continue
            item['title'] = res.get('desc').replace('抖音小助手','')
            item['id'] = hashlib.sha1(item['title'].encode()).hexdigest().upper()
            # is_exist = self.server.sismember(self.table, item['id'])  # 标题去重
            # if is_exist:  # 存在此标题，这个作者的页面结束抓取
            #     continue
            # self.server.sadd(self.table, item['id'])
            item['author'] = res.get('author').get('nickname')
            item['publish_time'] = time.strftime("%Y-%m-%d %X",time.localtime(res.get('create_time')))
            item['comment_count'] = res.get('statistics').get('comment_count')
            item['like_count'] = res.get('statistics').get('digg_count')
            item['play_count'] = 0
            item['forwarded_count'] = res.get('statistics').get('share_count') #转发数
            item['vlength'] = round(int(res.get('video').get('duration'))/1000) #由毫秒转化为秒
            item['vimg'] =res.get('video').get('cover').get('url_list')[0]
            vid = res.get('video').get('play_addr').get('uri')
            v_url = self.get_vid(vid)
            yield scrapy.Request(v_url,meta={"item":item},callback=self.parse_detail)

    def parse_detail(self,response):
        item = response.meta["item"]
        p = json.loads(response.text)
        a = p['data']['video_list']['video_2']['main_url']
        video_url = bytes.decode(base64.standard_b64decode(a))
        item['play_url'] =video_url
        item['down_url'] = video_url
        # yield item
        print(item)

    @staticmethod
    def right_shift(val, n):
        return val >> n if val >= 0 else (val + 0x100000000) >> n

    def get_vid(self,vid):
        video_url = 'http://i.snssdk.com/video/urls/v/1/toutiao/mp4/{}'
        # 'https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0300fe80000bg9419qbc5on1ul6v5og&line=0' #根据重定向返回的视频地址提取
        r = str(random.random())[2:]
        url = video_url.format(vid)
        m = url.replace('http://i.snssdk.com', '')
        n = m + '?r=' + r
        n = bytes(n, encoding="utf8")
        c = binascii.crc32(n)
        s = self.right_shift(c, 0)
        url = video_url.format(vid) + "?r={r}&s={s}".format(r=r, s=s)
        return url

    # https://git.imooc.com/coding-283/python-appium-app/src/master/douyin
    # https://www.iesdouyin.com/share/user/99622681013