#!/usr/bin/env python
# -*- coding: utf-8 -*-

import redis


class RedisInterface(object):

    # def __init__(self):
    pool = redis.ConnectionPool(host='127.0.0.1', port=6379, db=0) # password=''
    r = redis.Redis(connection_pool=pool)

    '''
    添加一个或多个元素到集合（key）里
    '''
    @classmethod
    def set_sadd(cls,key, *args):
        cls.r.sadd(key,*args)

    '''
    删除并获取集合key里的count个元素(这个2.10.6版本模块不支持count)
    '''
    @classmethod
    def set_spop(cls, key, count=1):
        return cls.r.spop(key)

    '''
    获取集合key里所有的元素
    '''
    @classmethod
    def set_smembers(cls, key):
        return cls.r.smembers(key)

    '''
    获取集合key里的元素数量
    '''
    @classmethod
    def set_scard(cls, key):
        return cls.r.scard(key)

    '''
    判断给定的value是不是集合key里的一个值
    '''
    @classmethod
    def set_sismember(cls, key, value):
        return cls.r.sismember(key,value)

    '''
    返回一个集合与给定集合的差集的元素.
    '''
    @classmethod
    def set_sdiff(cls, key, *args):
        return cls.r.sdiff(key, *args)

    '''
    在key集合中移除指定的元素. 如果指定的元素不是key集合中的元素则忽略 
    如果key集合不存在则被视为一个空的集合，该命令返回0.
    返回从集合中移除元素的个数(是指个数（integer），不是具体的值)，不包括不存在的成员.
    '''
    @classmethod
    def set_srem(cls, key, *args):
        return cls.r.srem(key, *args)

    '''
    从集合key里随机返回count个元素
    '''
    @classmethod
    def set_srandmember(cls, key, count=1):
        return cls.r.srandmember(key, count)

    '''
    删除一个或多个集合keys
    '''
    @classmethod
    def del_key(cls,*args):
        cls.r.delete(*args)

if __name__ == '__main__':
    # RedisInterface.set_sadd('test',*['ds','vu','ls'])
    # print RedisInterface.set_srem('test',*['ds','vu','ls'])
    # print list(RedisInterface.set_smembers('test')) # 从服务器只能写  还有个test键
    # print RedisInterface.set_srandmember('test',2)
    # print RedisInterface.set_sdiff('test',*['test1','test2'])
    # print RedisInterface.set_spop('test',2)
    # print RedisInterface.set_scard('test')
    # print RedisInterface.set_sismember('test','hs')
    # print RedisInterface.set_sismember('test','ds')
    # RedisInterface.del_key(*['test','test1','test2'])
    RedisInterface.set_sadd('test', *['ds'])
    while True:
        if not RedisInterface.set_scard('test'):
            pass
        print RedisInterface.set_spop('test')
    # print RedisInterface.set_spop('test') # 返回None
    pass