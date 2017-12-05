#!/user/bin/env python
# -*- coding: utf-8 -*-

import re
import os
import json
import time
import urllib
import sys
import re

def filter_list(*args):
    try:
        if len(list(args)) ==0:
            return []
        return filter(lambda x: re.sub('\s+','',x) ,list(args)) or []
    except TypeError:
        return []


def parse_img_url(*args):
    try:
        if len(list(args)) ==0:
            return []
        return map(lambda x: (re.search('url\((.+)\)',x)).group(1),list(args)) or []
    except Exception as err:
        return []



def filter_download_link(*args):
    try:
        return filter(lambda u: re.search('.(pdf|doc|zip|rar|docx|xls|PDF|xlsx)$',u,re.M | re.I),list(args)) or []
    except TypeError:
        return []


def print_log(dict):
    for key in dict.keys():
        print key,'--------------------------->',dict[key]


def make_dir(dir,c_dir):
    try:
        if not os.path.exists(os.path.join(dir, c_dir )):
            os.makedirs(os.path.join(dir, c_dir ))
        return True
    except:
        return False

def _get_file_name(link):
    if not isinstance(link,str):
        return None
    try:
        return str(time.time())+'_'+urllib.unquote(link.split('/')[-1]).decode('utf-8')
    except:
        return None
    pass


def re_search(pattern,str_content,groupNum=0):
    try:
        temp_text=re.search(pattern,str_content,re.M | re.I)
        return temp_text.group(groupNum) if temp_text else temp_text
    except:
        return None
    pass


if __name__=="__main__":
    #print _get_file_name("http://www.zzjgdj.cn/userfiles/file/2014%E5%B9%B4%E6%9D%90%E6%96%99/3%E6%9C%88%E4%BB%BD/%E6%8B%9F%E6%89%B9%E5%87%86%E7%9B%91%E6%B5%8B%E6%8A%A5%E5%91%8A%E5%85%AC%E7%A4%BA11-21.rar")

    file_links=[
        'http://zhaotoubiao.sipac.gov.cn/yqztbweb/ReadAttachFile.aspx?AttachID=9cedf8be-5c6f-433c-b363-b70d694b0536',
        'http://zhaotoubiao.sipac.gov.cn/yqztbweb/ReadAttachFile.aspx?AttachID=5f39e2e3-823e-4a3b-afa8-03a68bdec5a2'
    ]
    # file_download('test','./test/','huanping_shouli',file_links)

    # s='%E6%BC%B3%E5%B7%9E%E5%B8%82%E5%8D%8E%E5%A8%81%E7%94%B5%E6%BA%90%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8%E4%BA%8C%E6%9C%9F%E6%94%B9%E6%89%A9%E5%BB%BA%E9%A1%B9%E7%9B%AE%EF%BC%88%E6%8A%A5%E6%89%B9%E6%9C%AC%E5%85%A8%E6%9C%AC%EF%BC%89.pdf'
    # a='%e4%b8%ad%e6%a0%87%e9%80%9a%e7%9f%a5%e4%b9%a6.pdf'
    # b='http://'+urllib.unquote(a).decode('utf-8')
    a = 'background-image: url(https://img3.doubanio.com/view/celebrity/s_ratio_celebrity/public/p13830.webp)'
    print parse_img_url(a)