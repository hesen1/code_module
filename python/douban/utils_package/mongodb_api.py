#!/usr/bin/env python
#-*- coding: utf-8 -*-

from pymongo import MongoClient
from bson.objectid import ObjectId

class MongoDBApi(object):
    client = MongoClient('url')  # auth

    def __init__(self,database='test'):
        self.database = self.client[database]
        # self.collection = self.database[collection]

    # 返回ObjectID
    def insert_one(self,document,collection = 'test'):
        if not isinstance(document,dict):
            return None
        if collection:
            self.__change_collection(collection)
        return self.collection.insert_one(document).inserted_id

    # 返回一组ObjectID
    def insert_many(self,documents,collection = 'test'):
        if collection:
            self.__change_collection(collection)
        documents = list(documents)
        return self.collection.insert_many(documents=documents).inserted_ids

    def find_one(self,conditions,fields={},collection = 'test'):
        if not isinstance(conditions,dict):
            return None
        if not isinstance(fields,dict):
            return None
        if collection:
            self.__change_collection(collection)
        return self.collection.find_one(conditions,fields)

    def find(self,conditions,fields={},collection = 'test'):
        if not isinstance(conditions,dict):
            return None
        if not isinstance(fields,dict):
            return None
        if collection:
            self.__change_collection(collection)
        return self.collection.find(conditions,fields)

    def __change_collection(self,collection):
        self.collection = self.database[collection]
    pass


if __name__ == '__main__':
    document = {'title': u'寻梦环游记 Coco (2017)',
'cover_img': 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2503997609.jpg',
'celebrities': [
    {'href': 'https://movie.douban.com/celebrity/1022678/', 'role': u'导演', 'name': u'李\xb7昂克里奇 ',
    'img': 'https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p13830.jpg'},
    {'href': 'https://movie.douban.com/celebrity/1370425/', 'role': u'导演', 'name': u'阿德里安\xb7莫利纳 ',
    'img': 'https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1497195148.21.jpg'},
    {'href': 'https://movie.douban.com/celebrity/1370411/', 'role': u'饰 米格 Miguel', 'name': u'安东尼\xb7冈萨雷斯 ',
    'img': 'https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1489594517.9.jpg'},
    {'href': 'https://movie.douban.com/celebrity/1041009/', 'role': u'饰 埃克托 H\xe9ctor', 'name': u'盖尔\xb7加西亚\xb7贝纳尔 ',
    'img': 'https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1510634028.69.jpg'},
    {'href': 'https://movie.douban.com/celebrity/1036383/', 'role': u'饰 德拉库斯 Ernesto de la Cruz', 'name': u'本杰明\xb7布拉特 ',
    'img': 'https://img1.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1416762292.89.jpg'},
    {'href': 'https://movie.douban.com/celebrity/1056068/', 'role': u'饰 曾曾奶奶伊梅尔达 Mam\xe1 Imelda', 'name': u'阿兰纳\xb7乌巴奇 ',
    'img': 'https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p1356236309.26.jpg'}],
'summary': u'小男孩米格（安东尼\xb7冈萨雷斯 Anthony Gonzalez 配音）一心梦想成为音乐家，更希望自己能和偶像歌神德拉库斯（本杰明\xb7布拉特 Benjamin Bratt 配音）一样，创造出打动人心的音乐，但他的家族却世代禁止族人接触音乐。米格痴迷音乐，无比渴望证明自己的音乐才能，却因为一系列怪事，来到了五彩斑斓又光怪陆离的神秘世界。在那里，米格遇见了魅力十足的落魄乐手埃克托（盖尔\xb7加西亚\xb7贝纳尔 Gael Garc\xeda Bernal 配音），他们一起踏上了探寻米格家族不为人知往事的奇妙之旅，并开启了一段震撼心灵、感动非凡、永生难忘的旅程。',
'tag': u'未知',
'awards': [u'第83届纽约影评人协会奖 最佳动画片', u'第89届美国国家评论协会奖 最佳动画片 阿德里安\xb7莫利纳 / 李\xb7昂克里奇', u'第22届金卫星奖 电影部门 最佳动画片(提名)'],
'movie_info': {u'导演': u'李\xb7昂克里奇 / 阿德里安\xb7莫利纳',
                u'语言': u'英语 / 西班牙语',
                u'上映日期': u'2017-11-24(中国大陆) / 2017-10-20(莫雷利亚电影节) / 2017-11-22(美国)',
                u'主演': u'安东尼\xb7冈萨雷斯 / 盖尔\xb7加西亚\xb7贝纳尔 / 本杰明\xb7布拉特 / 阿兰纳\xb7乌巴奇 / 芮妮\xb7维克托 / 杰米\xb7卡米尔 / 阿方索\xb7阿雷奥 / 赫伯特\xb7西古恩萨 / 加布里埃尔\xb7伊格莱西亚斯 / 隆巴多\xb7博伊尔 / 安娜\xb7奥菲丽亚\xb7莫吉亚 / 娜塔丽\xb7科尔多瓦 / 赛琳娜\xb7露娜 / 爱德华\xb7詹姆斯\xb7奥莫斯 / 索菲亚\xb7伊斯皮诺萨 / 卡拉\xb7梅迪纳 / 黛娅娜\xb7欧特里 / 路易斯\xb7瓦尔德斯 / 布兰卡\xb7阿拉切利 / 萨尔瓦多\xb7雷耶斯 / 切奇\xb7马林 / 奥克塔维\xb7索利斯 / 约翰\xb7拉岑贝格',
                u'片长': u'105分钟',
                u'IMDb链接': u'tt2380307',
                u'制片国家/地区': u'美国',
                u'编剧': u'李\xb7昂克里奇 / 阿德里安\xb7莫利纳 / 马修\xb7奥尔德里奇 / 詹森\xb7卡茨',
                u'又名': u'可可夜总会(台) / 玩转极乐园(港) / 墨西哥亡灵节 / 亡灵节总动员 / 可可',
                 u'类型': u'喜剧 / 动画 / 音乐 / 家庭 / 冒险'},
              'douban_rating_average': 9.2,
              'movie_type': u'正在上映',
              'douban_url': u'https://movie.douban.com/subject/20495023/?from=playing_poster'}

    mongodb =MongoDBApi('test','test')
    # print mongodb.insert_one(document)
    print mongodb.find_one({'_id':ObjectId('id')},{'_id':1})
    pass



