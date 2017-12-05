#!/usr/bin/env python
#-*- coding: utf-8 -*-

import sys
import logging
import traceback

sys.path.append('../utils_package')

from mongodb_api import MongoDBApi
from thread_pool import ThreadPool
from bson.objectid import ObjectId


class DouBanPipeline(object):
    pool = ThreadPool(1)
    mongo_client = MongoDBApi()

    @classmethod
    def save_item(cls,item):
        cls.pool.callInThread(cls.__save_itme,item)
        pass

    @classmethod
    def __save_itme(cls,item):
        try:
            comments = []
            if item.has_key('comments'):
                comments = item.pop('comments')
            insert_id = cls.mongo_client.insert_one(item)
            if insert_id:
                insert_id = ObjectId(insert_id)
                for index,comment in enumerate(comments):
                    comment['movie_id'] = insert_id
                    comments[index] = comment
                if comments:
                    insert_ids = cls.mongo_client.insert_many(comments,'movie_comments')
                logging.warn(u'========保存一条信息=======\n')
            else:
                logging.warn(u'========一条信息保存失败=======\n')
        except Exception as err:
            logging.error(traceback.format_exc(err))