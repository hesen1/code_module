#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import logging
import traceback
import time
import sys


from pybloom import BloomFilter
from requests.exceptions import ConnectTimeout

sys.path.append('../utils_package')
from thread_pool import ThreadPool

class DownloadMiddleware(object):
    __filter_set = BloomFilter(capacity=100000, error_rate=0.001)
    pool = ThreadPool()

    @staticmethod
    def __request(**kwargs):
        if not kwargs.has_key('url'):
            return traceback.format_exc(ValueError(u'url是必须参数\n'))
        if not kwargs.has_key('method'):
            kwargs['method'] = 'get'
        callback = None
        if kwargs.has_key('callback'):
            callback = kwargs.pop('callback')
        if not kwargs.has_key('timeout'):
            kwargs['timeout'] = 10
        DOWNLOAD_DELAY = 0
        if kwargs.has_key('download_delay'):
            DOWNLOAD_DELAY = kwargs.pop('download_delay')   # 可以加个最少延迟时间 + 随机延迟时间 = 总延迟
        LEAST_DELAY = 0
        if kwargs.has_key('least_delay'):
            LEAST_DELAY = kwargs.pop('least_delay')
        times = 0
        while times < 3:
            try:
                if DOWNLOAD_DELAY or LEAST_DELAY:
                    time.sleep(DOWNLOAD_DELAY + LEAST_DELAY)
                res = requests.request(**kwargs)
                res.encoding='utf-8'
                if callback:
                    callback(res)
                    break
                else:
                    return res
            except ConnectTimeout as err:
                logging.info(u'========连接超时({})s,正在重连,当前第{}次==============\n'.format(10,times))
                times += 1
            except Exception as err:
                logging.error(traceback.format_exc(err))
                break
                times += 1

    @classmethod
    def single_thread_request(cls,**kwargs):
        if not kwargs.has_key('url'):
            raise ValueError(u'url是必须参数\n')

        if kwargs['url'] in cls.__filter_set:
            return
        cls.__filter_set.add(kwargs['url'])
        return cls.__request(**kwargs)

    @classmethod
    def request(cls,**kwargs):
        if not kwargs.has_key('url'):
            raise ValueError(u'url是必须参数\n')

        if kwargs['url'] in cls.__filter_set:
            return
        cls.__filter_set.add(kwargs['url'])
        cls.pool.callInThread(cls.__request, **kwargs)
        print u'=======当前线程数{}======\n'.format(cls.pool.workers)




if __name__ == '__main__':
    import random

    def parse(res):
        print res.status_code,'------>',res.url

    urls = [
        'https://www.uc123.com/',
        'https://www.baidu.com',
        'http://www.ufhqy.com',
        'https://www.qidian.com/',
        'https://www.readnovel.com/',
        'http://www.17k.com/',
        'https://www.xs8.cn/',
        'http://www.sdf.com',
        'https://www.hongxiu.com/',
        'http://chuangshi.qq.com/',
        'http://www.xxsy.net/',
        'http://www.rongshuxia.com/',
        'http://b.faloo.com/',
        'http://yuedu.163.com/index',
        'https://www.hupu.com/',
        'http://china.nba.com/',
        'http://www.vdvdo.com',
        'http://www.wancai.com/?pid=16640',
        'http://sports.cctv.com/',
        'http://sports.163.com/',
        'http://sports.ifeng.com/',
        'http://www.lesports.com/',
        'http://www.wdifuh.com',
        'http://sports.sina.com.cn/g/championsleague/'
    ]
    print len(urls),'----------------------------\n\n'

    print time.time(), time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()), '\n\n'
    # a = {'callback': parse}
    for i in range(0,len(urls)):
        DownloadMiddleware.request(url=urls[i],callback=parse,download_delay=round(2*random.random()))
        # time.sleep(0.3)
    print time.time(), time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()), '\n\n'

    #   将res压入queue，主线程去解析