#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys

sys.path.append('../config_package')
sys.path.append('../utils_package')
sys.path.append('../middlewares')
sys.path.append('../pipelines_package')

# 正在上映的url
from spider_urls import now_playing,coming,choice_movie

# user_agent列表
from user_agents import agents

# redis接口
from custom_redis import RedisInterface

# 导入自定义的requests
from downloadmiddleware import DownloadMiddleware as request

from mongodb_api import MongoDBApi


from doubanpipeline import DouBanPipeline

from thread_pool import ThreadPool

#
import utils