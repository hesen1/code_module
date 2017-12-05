#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import time
# import Queue
import random
import logging

# from Queue import Empty
import load_package as utils_package

from lxml import etree
from load_package import request as requests

reload(sys)
sys.setdefaultencoding('utf-8')

logging.basicConfig(datefmt='%a, %d %b %Y %H:%M:%S')

class NowPlayingListSpider(object):
    # queue = Queue.Queue(0)  ,download_delay=round(2*random.random(),2)
    redis = utils_package.RedisInterface()

    def __init__(self):
        self.start_urls = utils_package.now_playing
        self.user_agents = utils_package.agents
        for url in self.start_urls:
            logging.info(u'===一共{}项====正在爬取url: {}====\n'.format(len(self.start_urls),url))
            headers = {
                'User-agent':random.choice(self.user_agents),
                'Host': 'movie.douban.com',
            }
            try:
                requests.single_thread_request(url=url,headers=headers,method='get',callback=self.parse)
            except Exception as err:
                logging.warn(u'======url: {}=====请求失败=====\n'.format(url))
                logging.error(err)
        logging.info(u'======爬取完毕========\n')

    def parse(self,response):
        try:
            selector = etree.HTML(response.text)
            hrefs = selector.xpath('//div[@id="nowplaying"]//li[@class="poster"]/a/@href')
            # hrefs = [url+'?from=playing_poster' for url in hrefs]
            logging.info(u'=====一共解析{}个url=======\n'.format(len(hrefs)))
            self.redis.set_sadd('movies',*hrefs) if hrefs else []
        except Exception as err:
            logging.error(err)
        pass



if __name__ == '__main__':
    now_playing = NowPlayingListSpider()
