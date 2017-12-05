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
import urllib

from Queue import Empty
import load_package as utils_package

from lxml import etree
from load_package import request as requests
from load_package import DouBanPipeline
from load_package import ThreadPool
from mongodb_api import MongoDBApi
from pybloom import BloomFilter

reload(sys)
sys.setdefaultencoding('utf-8')

logging.basicConfig(datefmt='%a, %d %b %Y %H:%M:%S')

class DetailSpider(object):
    queue = Queue.Queue(0)
    redis = utils_package.RedisInterface()
    __begin_parse = False
    pool = ThreadPool(1)
    mongodb_client = MongoDBApi()
    f = BloomFilter(capacity=10000, error_rate=0.001)

    # 太快了，还有后面不能正常退出
    def __init__(self,timeout = 8):
        self.__get_old_url()
        self.user_agents = utils_package.agents
        delay = 0.0005
        endtime = time.time() + timeout
        # self.redis.set_sadd('movies', *['https://movie.douban.com/subject/20495023/?from=playing_poster','https://movie.douban.com/subject/25837262/','https://movie.douban.com/subject/26378579/?tag=%E7%83%AD%E9%97%A8&from=gaia'])
        while True:
            url = self.redis.set_spop('movies')
            if not url:
                delay = min(2*delay,timeout,.05)
                time.sleep(delay)
                if endtime - time.time() <= 0.0:
                    logging.warn(u'========请求完毕=======\n')
                    break
                continue
            if url in self.f:
                continue
            logging.warn(u'====正在爬取url: {}====\n'.format(url))
            headers = {
                'User-agent': random.choice(self.user_agents),
                'Host': 'movie.douban.com',
                'Origin': 'https: // movie.douban.com'
            }
            try:
                requests.request(url=url,headers=headers,method='get',callback=self.__put_queue,least_delay=0.5,download_delay=round(2*random.random(),2))
                delay = 0.0005
                if not self.__begin_parse:
                    self.pool.callInThread(self.__parse_item)
                    self.__begin_parse = True
                time.sleep(1.2)
            except Exception as err:
                logging.warn(u'======url: {}=====请求失败=====\n'.format(url))
                logging.error(err)

    def __get_old_url(self):
        results = self.mongodb_client.find({"movie_type" : "往期电影"},{"douban_url":1})
        for result in results:
            self.f.add(result['douban_url'])

    def __put_queue(self,res):
        try:
            self.queue.put(res)
        except Exception as err:
            logging.error(traceback.format_exc(err))

    def __parse_item(self):
        while True:
            try:
                res = self.queue.get(timeout=12)
                self.parse(res)
            except Empty as err:
                logging.warn(u'========抓取完毕=======\n')
                break

    # 数据已经解析完成--》 可以考虑吧评论也解析出来，有ObjectID入库，把movie_info_data换个键值
    def parse(self,response):
        try:
            selector = etree.HTML(response.text)
            item = self.__get_item(selector,response.url)
            hot_comments = self.__get_comments(selector)
            if hot_comments:
                item['comments'] = hot_comments
            DouBanPipeline.save_item(item)
        except Exception as err:
            logging.error(err)


    def __get_comments(self,selector):
        try:
            hot_comments_count = selector.xpath('count(//div[@id="hot-comments"]/div[@class="comment-item"])')
            hot_comments_count = int(float(hot_comments_count)) + 1 if hot_comments_count else 0
            hot_comments = []
            update_time = time.strftime('%Y-%m-%d %H:%M:%S',time.localtime())
            for i in xrange(1, hot_comments_count):
                votes = selector.xpath(
                    '//div[@id="hot-comments"]/div[@class="comment-item"][{}]//span[@class="votes"]/text()'.format(i))
                votes = ''.join(votes).strip() if votes else None
                username = selector.xpath(
                    '//div[@id="hot-comments"]/div[@class="comment-item"][{}]//span[@class="comment-info"]/a/text()'.format(
                        i))
                username = ''.join(username).strip() if username else None
                douban_user_link = selector.xpath(
                    '//div[@id="hot-comments"]/div[@class="comment-item"][{}]//span[@class="comment-info"]/a/@href'.format(
                        i))
                douban_user_link = ''.join(douban_user_link).strip() if douban_user_link else None
                user_rating = selector.xpath(
                    '//div[@id="hot-comments"]/div[@class="comment-item"][{}]//span[contains(@class,"allstar")]/@class'.format(
                        i))
                user_rating = re.search('allstar(\d+)', ''.join(user_rating)) if user_rating else None
                user_rating = int(user_rating.group(1)) if user_rating else 0
                comment_time = selector.xpath(
                    '//div[@id="hot-comments"]/div[@class="comment-item"][{}]//span[@class="comment-time "]/@title'.format(
                        i))
                comment_time = ''.join(comment_time).strip() if comment_time else None
                comment_text = selector.xpath(
                    '//div[@id="hot-comments"]/div[@class="comment-item"][{}]/div[@class="comment"]/p/text()'.format(i))
                comment_text = ''.join(comment_text).strip() if comment_text else None
                comment = {
                    'votes': votes,
                    'username': username,
                    'douban_user_link': douban_user_link,
                    'user_rating': user_rating,
                    'comment_time': comment_time,
                    'comment_text': comment_text,
                    'source': u'豆瓣',
                    'update_time': update_time
                }
                hot_comments.append(comment)
            return hot_comments
        except Exception as err:
            logging.error(err)
            return None

    def __get_item(self,selector,url):
        title = utils_package.utils.filter_list(*selector.xpath('//div[@id="content"]/h1//text()'))
        title = ' '.join(title)
        cover_img = selector.xpath('//div[@id="mainpic"]//img/@src')
        cover_img = cover_img[0] if cover_img else None
        movie_info = selector.xpath('//div[@id="info"]//text()')
        movie_info = ''.join(movie_info).strip()
        movie_info = utils_package.utils.filter_list(*movie_info.split('\n'))
        temp = {}
        for item in movie_info:
            try:
                k, v = tuple(item.split(':'))
            except:
                k, v = tuple(item.split(u'：'))
            temp[k.strip()] = v.strip()
        movie_info_data = {
            'director': temp.get(u'导演', None),
            'type': temp.get(u'类型', None),
            'nickname': temp.get(u'又名', None),
            'language': temp.get(u'语言', None),
            'release_date': temp.get(u'上映日期', None),
            'leading_role': temp.get(u'主演', None),
            'length_of_a_film': temp.get(u'片长', None),
            'IMDb_link': temp.get(u'IMDb链接', None),
            'producer_regions': temp.get(u'制片国家/地区', None),
            'screenwriter': temp.get(u'编剧', None)
        }
        rating_average = selector.xpath('//div[@id="interest_sectl"]//strong[@class="ll rating_num"]/text()')
        rating_average = float(''.join(rating_average).strip())
        summary = utils_package.utils.filter_list(*selector.xpath('//div[@id="link-report"]/span/text()'))
        summary = ''.join(summary).strip()
        celebrities_imgs = utils_package.utils.parse_img_url(
            *selector.xpath('//div[@id="celebrities"]/ul/li//div[@class="avatar"]/@style'))
        celebrities_hrefs = selector.xpath('//div[@id="celebrities"]/ul/li//div[@class="info"]//a/@href')
        celebrities_names = selector.xpath('//div[@id="celebrities"]/ul/li//div[@class="info"]//a/@title')
        celebrities_roles = selector.xpath(
            '//div[@id="celebrities"]/ul/li//div[@class="info"]//span[@class="role"]/@title')
        celebrities = []
        for i in xrange(0, len(celebrities_names)):
            role = {
                'img': celebrities_imgs[i] if i < len(celebrities_imgs) else None,
                'href': celebrities_hrefs[i] if i < len(celebrities_hrefs) else None,
                'name': celebrities_names[i] if i < len(celebrities_names) else None,
                'role': celebrities_roles[i] if i < len(celebrities_roles) else None
            }
            celebrities.append(role)
        awards_num = selector.xpath('count(//div[@class="mod"]/ul[@class="award"])')
        awards_num = int(float(awards_num)) if awards_num else 0
        awards = []
        for i in xrange(1, awards_num + 1):
            award = utils_package.utils.filter_list(
                *selector.xpath('//div[@class="mod"]/ul[@class="award"][{}]//text()'.format(i)))
            award = ' '.join(award).strip().replace(u'\xa0', '')
            awards.append(award)
        item = {}
        item['title'] = title
        item['cover_img'] = cover_img
        item['summary'] = summary
        item['celebrities'] = celebrities
        item['awards'] = awards
        item['douban_rating_average'] = rating_average
        url = urllib.unquote(str(url)).decode('utf-8')
        logging.warn(u'========{} 解析中======\n'.format(url))
        item['douban_url'] = url
        tag = re.search('tag=(.+)&from', url)
        from_ = re.search('from=(.+)', url)
        from_ = from_.group(1) if from_ else ''
        if from_ == 'playing_poster':
            from_ = u'正在上映'
        elif from_ == 'gaia_video' or from_ == 'gaia':
            from_ = u'往期电影'
        else:
            from_ = u'即将上映'
        item['tag'] = tag.group(1) if tag else u'未知'
        item['movie_type'] = from_
        item['source'] = u'豆瓣'
        item['movie_info'] = movie_info_data
        item['update_time'] = time.strftime('%Y-%m-%d %H:%M:%S',time.localtime())
        return item

if __name__ == '__main__':
    detail_spider=DetailSpider()
