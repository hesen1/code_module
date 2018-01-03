# -*- coding: utf-8 -*-
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
    # start_register_no = 199297 # 著作权最低编号
    # end_register_no = 238200 # 最高编号
    # search_profix = u'渝作登字-2017-F-00' # 搜索条件前缀

    proxyHost = "http-pro.abuyun.com"
    proxyPort = "9010"

    # 代理隧道验证信息
    proxyUser = "HSL083KDN1A99WGP"
    proxyPass = "D4B6956002DE7C12"

    service_args = [
        "--proxy-type=http",
        "--proxy=%(host)s:%(port)s" % {
            "host": proxyHost,
            "port": proxyPort,
        },
        "--proxy-auth=%(user)s:%(pass)s" % {
            "user": proxyUser,
            "pass": proxyPass,
        },
    ]

    def parse(self,response):
        with codecs.open('search_condition.json','r',encoding='utf-8') as f:
            urls = json.load(f)
        if not urls:
            raise Exception(u'请在search_condition.json文件中更具格式配置好搜索条件\n')
        for item in urls:
            logging.warn(u'====准备开始搜索:{}-{}~{}====\n'.format(item['search_profix'],item['start_register_no'],item['end_register_no']))
            yield scrapy.Request(url='http://www.baidu.com',dont_filter=True,meta={'conditions':item},callback=self.parse_1)

    def parse_1(self, response):
        index_url = 'http://203.207.196.210:8080/registerinfo/combine.do'
        domain = 'http://203.207.196.210:8080'
        start_register_no = response.meta['conditions']['start_register_no']  # 著作权最低编号
        end_register_no = response.meta['conditions']['end_register_no']  # 最高编号
        search_profix = response.meta['conditions']['search_profix']  # 搜索条件前缀

        for no in xrange(start_register_no,end_register_no):
            try:
                no = str(no)
                while len(no) < 8:
                    no = '0'+ no
                self.dcap["phantomjs.page.settings.userAgent"] = random.choice(agents)
                driver = webdriver.PhantomJS(desired_capabilities=self.dcap,
                                             service_args=self.service_args)  # .Chrome('E:/Python27/Scripts/chromedriver.exe')
                driver.get(index_url)
                search_button = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located(
                        (By.XPATH, '//table[@id="search_table"]//input[contains(@type,"submit")]'))
                )
                time.sleep(5)
                driver.save_screenshot('html.png')
                safe_code = driver.find_element_by_xpath('//img[@id="safecode"]')
                time.sleep(1.5)

                left = int(safe_code.location['x'])
                top = int(safe_code.location['y'])
                right = left + int(safe_code.size['width'])
                bottom = top + int(safe_code.size['height'])

                im = Image.open('html.png')
                im = im.crop((left, top, right, bottom))
                im.save('safecode.png')

                safe_code_num = pytesseract.image_to_string(Image.open('safecode.png'),
                                                            config=self.tessdata_dir_config)  # lang='chi_sim'
                print u'======当前验证码为: %s======' % safe_code_num, '\n'

                register_no = driver.find_element_by_xpath('//table[@id="search_table"]//input[@name="registerno"]')
                time.sleep(1)
                register_no.clear()
                register_no.send_keys(search_profix+str(no))
                time.sleep(0.4)

                work_type = Select(driver.find_element_by_id('worktype'))
                time.sleep(1)
                work_type.select_by_value(u'美术')
                time.sleep(0.2)

                check_code = driver.find_element_by_id('check_code')
                time.sleep(1)
                check_code.clear()
                check_code.send_keys(safe_code_num)
                time.sleep(0.3)

                logging.warn(u'===========开始搜索{}==========\n'.format(search_profix+str(no)))
                search_button.click()
                time.sleep(0.6)

                all_link_elem = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.ID, 'all_link'))
                )
                time.sleep(5)

                selector = Selector(text=driver.page_source)
                item_count_num = selector.xpath('count(//div[@id="all_link"]//li)').extract_first()
                item_count_num = int(float(item_count_num)) + 1 if item_count_num else 0

                if not item_count_num:
                    logging.warn(u'=====当前条件：{}没有作品=====\n'.format(search_profix+str(no)))
                logging.warn(u'=====一共有{}项=====\n'.format(item_count_num))

                for i in xrange(1, item_count_num):
                    url = selector.xpath('//div[@id="all_link"]//li[{}]/a/@href'.format(i)).extract_first()
                    if url:
                        headers = {
                            'User-Agent': random.choice(agents),
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                            'Accept-Encoding': 'gzip, deflate',
                            'Accept-Language':'zh-CN,zh;q=0.9',
                            'Cache-Control': 'max-age=0',
                            'Connection': 'keep-alive',
                            # 'Cookie': 'JSESSIONID=4236F0574B03ABBF8E648B032F074B2E',
                            'Host': '203.207.196.210:8080',
                            'Referer':'http://203.207.196.210:8080/registerinfo/combine.do',
                            'Upgrade-Insecure-Requests':str(1)
                        }
                        # yield scrapy.Request(url=domain + url,dont_filter=True,callback=self.parse_page)
                        res = requests.get(url=domain + url,proxies=get_proxy(),headers=headers)
                        item = self.parse_page(res)
                        yield item
                        # print item
                        time.sleep(1)

            except NoSuchElementException as err:
                logging.error(err)
                record_fail_search(search_profix + str(no), err,safe_code_num)
                continue

            except Exception as err:
                logging.error(err)
                record_fail_search(search_profix+str(no),err,safe_code_num)
                continue
            finally:
                driver.quit()

        # time.sleep(5)
        # driver.quit()


    def parse_page(self,response):
        url = response.url
        response = Selector(text=response.text)
        writing_name = filter_list(*response.xpath('//div[@id="text_real"]//tr[2]/td[2]//text()').extract())
        writing_name = ''.join(writing_name) if writing_name else ''
        writing_type = filter_list(*response.xpath('//div[@id="text_real"]//tr[3]/td[2]//text()').extract())
        writing_type = ''.join(writing_type) if writing_type else ''
        owner_name = filter_list(*response.xpath('//div[@id="text_real"]//tr[3]/td[4]//text()').extract())
        owner_name = ''.join(owner_name) if owner_name else ''
        nationality = filter_list(*response.xpath('//div[@id="text_real"]//tr[4]/td[2]//text()').extract())
        nationality = ''.join(nationality) if nationality else ''
        province = filter_list(*response.xpath('//div[@id="text_real"]//tr[4]/td[4]//text()').extract())
        province = ''.join(province) if province else ''
        city = filter_list(*response.xpath('//div[@id="text_real"]//tr[5]/td[2]//text()').extract())
        city = ''.join(city) if city else ''
        writer = filter_list(*response.xpath('//div[@id="text_real"]//tr[6]/td[2]//text()').extract())
        writer = ''.join(writer) if writer else ''
        creation_date = filter_list(*response.xpath('//div[@id="text_real"]//tr[7]/td[2]//text()').extract())
        creation_date = ''.join(creation_date) if creation_date else ''
        firstpub_date = filter_list(*response.xpath('//div[@id="text_real"]//tr[7]/td[4]//text()').extract())
        firstpub_date = ''.join(firstpub_date) if firstpub_date else ''
        registration_mark = filter_list(*response.xpath('//div[@id="text_real"]//tr[8]/td[2]//text()').extract())
        registration_mark = ''.join(registration_mark) if registration_mark else ''
        record_date = filter_list(*response.xpath('//div[@id="text_real"]//tr[8]/td[4]//text()').extract())
        record_date = ''.join(record_date) if record_date else ''
        issue_date = filter_list(*response.xpath('//div[@id="text_real"]//tr[9]/td[2]//text()').extract())
        issue_date = ''.join(issue_date) if issue_date else ''

        item = RuanjianzzqPaintingItem()
        item['writing_name'] = writing_name
        item['writing_type'] = writing_type
        item['owner_name'] = owner_name
        item['nationality'] = nationality
        item['province'] = province
        item['city'] = city
        item['writer'] = writer
        item['creation_date'] = creation_date
        item['firstpub_date'] = firstpub_date
        item['registration_mark'] =registration_mark
        item['record_date'] = record_date
        item['issue_date'] = issue_date
        item['url'] = url
        item['table_name'] = 'writingInfo__allcountry_WritingInfoBureau'

        return item



