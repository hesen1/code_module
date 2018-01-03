# -*- coding: utf-8 -*-

'''
    这是一个用tesseract库识别image的一个例子
'''


import scrapy
import time
import logging
import pytesseract
import sys
import random
import requests
import codecs
import json

# from scrapy.utils.project import get_project_settings

from scrapy import Selector
from PIL import Image
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

from ..utils_package.user_agents import agents
from ..utils_package.utils import record_fail_search,filter_list,get_proxy
from ..items import RuanjianzzqPaintingItem

reload(sys)
sys.setdefaultencoding('utf-8')

pytesseract.pytesseract.tesseract_cmd = 'E:\\Program Files (x86)\\Tesseract-OCR\\tesseract.exe'

class PaintingSpider(scrapy.Spider):
    name = 'painting'
    allowed_domains = ['www.baidu.com']
    start_urls = ['http://www.baidu.com/']
    dcap = dict(DesiredCapabilities.PHANTOMJS)
    tessdata_dir_config = '--tessdata-dir "E:\\Program Files (x86)\\Tesseract-OCR\\tessdata"'
    # start_register_no = 199297 
    # end_register_no = 238200 
    # search_profix = u''

    proxyHost = "http-pro.abuyun.com"
    proxyPort = "9010"

    # 代理隧道
