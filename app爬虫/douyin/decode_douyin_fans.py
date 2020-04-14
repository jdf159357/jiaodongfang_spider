import json
from handler_db import save_data
from mitmproxy import ctx


def response(flow):
    if 'aweme.snssdk.com/aweme/v1/user/follower/list' in flow.request.url:
        for user in json.loads(flow.response.text)['followers']:
            info = dict()
            info['share_id'] = user['uid']
            info['id'] = user['short_id']
            info['nickname'] = user['nickname']
            try:
                # print(info)
                save_data(info)
                ctx.log.info('{}保存成功'.format(info['share_id']))
            except:
                ctx.log.info('{}保存重复'.format(info['share_id']))