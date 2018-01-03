# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html

import MySQLdb
import MySQLdb.cursors
import codecs
import json

from twisted.enterprise import adbapi

class RuanjianzzqPaintingPipeline(object):
    def __init__(self, dbpool):
        self.dbpool = dbpool

    @classmethod
    def from_settings(cls, settings):
        dbargs = dict(
            host = settings['MYSQL_HOST'],
            db = settings['MYSQL_DBNAME'],
            port = settings['MYSQL_PORT'],
            user = settings['MYSQL_USER'],
            passwd = settings['MYSQL_PASSWD'],
            charset = 'utf8',
            cursorclass = MySQLdb.cursors.DictCursor,
            use_unicode = True,
        )
        dbpool = adbapi.ConnectionPool('MySQLdb', **dbargs)
        return cls(dbpool)

    def _copy_item_to_dict(self,item):
        value_dict = {}
        for key,value in item.items():
            if value:
                value_dict[key] = value
            # print key,'---------',value  a
        # with codecs.open(value_dict['table_name']+'.json', 'a', 'utf-8') as f:
        #     data=json.dumps(value_dict,ensure_ascii=False)+'\n\n'
        #     f.write(data)
        return value_dict;

    def _sql_create(self,value_dict):
        table_name = value_dict['table_name']
        del value_dict['table_name']
        format_key_field = lambda field: "`" + field + "`"
        format_v_field = lambda field: "'" + field + "'"
        sql = "INSERT IGNORE INTO `{}`({}) ".format(table_name,','.join([format_key_field(x) for x in value_dict.keys()])) + \
                    "values({})".format(','.join([format_v_field(x) for x in value_dict.values()]))
        # print sql,'%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%'
        return sql

    def process_item(self, item, spider):
        valid = True
        for data in item:
            if not data:
                valid = False
                print 'NOT ANY DATA IN ITEM'

        if valid:
            d = self.dbpool.runInteraction(self._do_update, item, spider)
            return item

    def _do_update(self, conn, item, spider):
            value_dict=self._copy_item_to_dict(item)
            try:
                mysql = self._sql_create(value_dict)
                result =conn.execute(mysql)
                if result:
                    print 'added a record'
                else:
                    print 'failed insert into table '

            except Exception as e:
                with open('sql_error.txt', 'a') as f:
                    f.write(item['myurl'] + '\n')
                print e
