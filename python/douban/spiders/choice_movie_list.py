#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import time
import Queue
import random
import logging
import json
import re
import traceback

from Queue import Empty
import load_package as utils_package

from lxml import etree
from load_package import request as requests

reload(sys)
sys.setdefaultencoding('utf-8')

class ChoiceMovieListSpider(object):
    queue = Queue.Queue(0)
    redis = utils_package.RedisInterface()
    tags = [
        u'热门',u'最新',u'经典',u'可播放',u'豆瓣高分',u'冷门佳片',u'华语',u'欧美',u'韩国',
        u'日本',u'动作',u'喜剧',u'爱情',u'科幻',u'悬疑',u'恐怖',u'文艺'
    ]

    def __init__(self):
        self.start_url = utils_package.choice_movie[0]
        self.user_agents = utils_package.agents
        for tag in self.tags:
            logging.info(u'===一共{}项====正在爬取url: {}====\n'.format(len(self.tags), self.start_url.format(tag)))
            headers = {
                'User-agent': random.choice(self.user_agents),
                'Host': 'movie.douban.com',
            }
            try:
                requests.request(url=self.start_url.format(tag),download_delay=round(2*random.random(),2),headers=headers, method='get', callback=self.parse,least_delay=0.5)
            except Exception as err:
                logging.warn(u'======url: {}=====请求失败=====\n'.format(self.start_url.format(tag)))
                logging.error(err)
                time.sleep(1)

    def parse(self,response):
        try:
            data =json.loads(response.text)
            if data['subjects']:
                # data['source_url'] = response.url
                tag = re.search('tag=(.+)&sort',response.url)
                tag = tag.group(1) if tag else None
                if tag:
                    for index,movie in enumerate(data['subjects']):
                        data['subjects'][index]['url'] += '?tag={}&from=gaia_video'.format(tag)  #  TODO: 待测试
                self.queue.put(data)
                headers = {
                    'User-agent': random.choice(self.user_agents),
                    'Host': 'movie.douban.com',
                }
                url = response.url
                limit = re.search('page_limit=(\d+)',url)
                limit = int(limit.group(1)) if limit else 20
                page_start = re.search('page_start=(\d+)',url)
                page_start = int(page_start.group(1)) if page_start else -1
                if page_start == -1:
                    logging.error(traceback.format_exc(ValueError(u'page_start值不正确====url: {}===\n'.format(url))))
                    return
                print limit,'====',page_start,'====',page_start,'===='
                url = re.sub('page_start=(\d+)','page_start='+str(page_start+limit),url)
                requests.request(url=url, download_delay=round(2 * random.random(), 2),
                                 headers=headers, method='get', callback=self.parse,least_delay=0.5)
            else:
                logging.warn(u'=====完成一类url: {}======\n'.format(response.url))

        except Exception as err:
            logging.error(traceback.format_exc(err))
            pass

    @classmethod
    def parse_urls(cls):
        while True:
            try:
                data = cls.queue.get(timeout=10)
                for movie in data['subjects']:
                    cls.redis.set_sadd('movies',movie['url'])
                    # print movie['url']
            except Empty as err:
                logging.error(err)
                break


if __name__ == '__main__':
    choice_movie = ChoiceMovieListSpider()
    ChoiceMovieListSpider.parse_urls()
    print '\nok==============\n'