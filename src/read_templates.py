# -*- coding:utf-8 -*-
import logging
import sys
import time
import math
import re

from Chatbot.configs import Configs
import pymysql
from functools import cmp_to_key

logger = logging.getLogger(Configs.PROJECT_NAME + ".sub")


class ReadTemplates(object):
    def __init__(self):
        self.db_con = None
        self._con()
        self.cursor = self.db_con.cursor()
        self.features = self.read_features()
        self.generals = self.read_general()
        self.type_index = dict()
        self.type_index['SP_ANS'] = 1
        self.type_index['PRIOR_MATCH'] = 2
        self.type_index['SIMPLE_LOGIC'] = 3
        self.type_index['SWITCH'] = 4
        self.type_index['COREFERENCE'] = 5
        self.type_index['RELATION'] = 6
        self.type_index['COMMON'] = 7

    def _con(self):
        self.db_con = pymysql.connect(host=Configs.db_ip,
                                      port=Configs.db_port,
                                      user=Configs.db_username,
                                      passwd=Configs.db_password,
                                      db=Configs.db_templates,
                                      use_unicode=True,
                                      charset='utf8')

    def check_con(self, num=10, stime=3):
        """
        :param num: 重连次数
        :param stime:每次休眠时间
        :desc: Mysql 超时重连
        """
        attempt = 0
        status = True
        while status and attempt <= num:
            try:
                self.db_con.ping(reconnect=True)
                status = False
            except:
                if self._con():
                    break
                sys.stderr.write("[read_templates] new mysql connection %s time error\n" % attempt)
                attempt += 1
                time.sleep(stime)

    def read_general(self):
        sql = "SELECT * FROM general;"
        self.check_con()
        self.cursor.execute(sql)
        db_res = self.cursor.fetchall()
        general = dict()
        for i in db_res:
            if not general.get(i[1], []):
                general[i[1]] = []
            general[i[1]].append(i[2])
        return general

    @staticmethod
    def parse_general(pattern: str, generals: dict):
        for item in generals:
            p = re.compile(r"\[GENERAL:%s\]" % item)
            pattern = p.sub(ReadTemplates.get_re(generals[item]), pattern)
        return pattern

    def read_patterns(self, this_type: str):
        pattern_sql = "SELECT * FROM pattern WHERE type=%s;"
        self.check_con()
        self.cursor.execute(pattern_sql, this_type)
        db_res = self.cursor.fetchall()
        patterns = []
        for item in db_res:
            pattern = ReadTemplates.parse_feature(item[2], self.features)
            pattern = ReadTemplates.parse_general(pattern, self.generals)
            patterns.append(pattern)
        return patterns

    def add_pattern(self, this_type: str, content: str):
        type_index = self.type_index[this_type]
        pattern_sql = "INSERT INTO pattern (type, pattern, priority, type_index) VALUES (%s, %s, %s, %s);"
        self.check_con()
        self.cursor.execute(pattern_sql, (this_type, content, 0, type_index))
        self.db_con.commit()
        return True

    def del_pattern(self, pattern_list: list):
        self.check_con()
        for pattern_id in pattern_list:
            pattern_sql = "DELETE FROM pattern WHERE id=%s;"
            self.cursor.execute(pattern_sql, pattern_id)
        self.db_con.commit()
        return True

    def all_patterns(self, page: int, page_size: int):
        pattern_sql = "SELECT * FROM pattern LIMIT %s OFFSET %s;"
        self.check_con()
        count_sql = "SELECT COUNT(*) FROM pattern;"
        self.cursor.execute(count_sql)
        count = self.cursor.fetchall()[0][0]
        total_page = math.ceil(float(count) / page_size)
        page = total_page if page > total_page else page
        self.cursor.execute(pattern_sql, (page_size, page_size * (page - 1)))
        db_res = self.cursor.fetchall()
        all_patterns = list()
        for item in db_res:
            pattern = list()
            pattern.append(item[0])
            pattern.append(item[1])
            pattern.append(item[2])
            pattern.append(item[3])
            pattern.append(item[4])
            all_patterns.append(pattern)
        all_patterns.sort(key=cmp_to_key(lambda x, y: x[4] - y[4]))

        return all_patterns, count, total_page

    def all_dicts(self):
        dicts_sql = "SELECT * FROM dict;"
        self.check_con()
        self.cursor.execute(dicts_sql)
        db_res = self.cursor.fetchall()
        all_dicts = dict()
        for item in db_res:
            if not all_dicts.get(item[1], []):
                all_dicts[item[1]] = []
            all_dicts[item[1]].append(item[2])
        print(all_dicts)
        return all_dicts

    def all_slots(self, page: int, page_size: int):
        slots_sql = "SELECT * FROM slots LIMIT %s OFFSET %s;"
        self.check_con()
        count_sql = "SELECT COUNT(*) FROM slots;"
        self.cursor.execute(count_sql)
        count = self.cursor.fetchall()[0][0]
        total_page = math.ceil(float(count) / page_size)
        page = total_page if page > total_page else page
        self.cursor.execute(slots_sql, (page_size, page_size * (page - 1)))
        db_res = self.cursor.fetchall()
        all_slots = []
        for item in db_res:
            all_slots.append(item[1])
        return all_slots, count, total_page

    def all_features(self):
        features_sql = "SELECT * FROM features_index;"
        self.check_con()
        self.cursor.execute(features_sql)
        db_res = self.cursor.fetchall()
        all_features = []
        for item in db_res:
            all_features.append(item[1])
        return all_features

    def all_generals(self):
        generals_sql = "SELECT * FROM generals_index;"
        self.check_con()
        self.cursor.execute(generals_sql)
        db_res = self.cursor.fetchall()
        all_generals = []
        for item in db_res:
            all_generals.append(item[1])
        return all_generals

    def read_features(self):
        dict_sql = "SELECT * FROM dict;"
        self.check_con()
        self.cursor.execute(dict_sql)
        dict_res = self.cursor.fetchall()
        features = dict()
        for i in dict_res:
            if not features.get(i[1], []):
                features[i[1]] = []
            features[i[1]].append(i[2])
        return features

    def add_features(self, dict_key: str, dict_value: list):
        self.check_con()
        index_sql = "INSERT INTO features_index (feature_key) VALUES (%s);"
        self.cursor.execute(index_sql, dict_key)
        for value in dict_value:
            dict_sql = "INSERT INTO dict (dict_key, dict_value) VALUES (%s, %s);"
            self.cursor.execute(dict_sql, (dict_key, value))
        self.db_con.commit()
        return True

    @staticmethod
    def parse_feature(pattern: str, features: dict):
        for item in features:
            p = re.compile(r"\[FEATURE:%s\]" % item)
            pattern = p.sub(ReadTemplates.get_re(features[item]), pattern)
        return pattern

    @staticmethod
    def get_re(re_list: list):
        core = ""
        for item in re_list:
            core += item
            core += "|"
        if core:
            core = core[:-1]
        general = "(?:%s)" % core
        return general


if __name__ == '__main__':
    templates = ReadTemplates()
    # templates.parse_feature("[FEATURE:other][FEATURE:more]", {"other": ["还有", "还有哪些"], "more": ["呢", "哪些呢", "什么呢"]})
    templates.read_patterns("COMMON")
