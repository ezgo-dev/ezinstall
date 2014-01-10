#!/usr/bin/python
# -*- encoding: utf-8 -*-

import csv
import os.path
import json
import codecs
import os
import cStringIO

class UTF8Recoder:
    """
    Iterator that reads an encoded stream and reencodes the input to UTF-8
    """
    def __init__(self, f, encoding):
        self.reader = codecs.getreader(encoding)(f)

    def __iter__(self):
        return self

    def next(self):
        return self.reader.next().encode("utf-8")

class UnicodeReader:
    """
    A CSV reader which will iterate over lines in the CSV file "f",
    which is encoded in the given encoding.
    """

    def __init__(self, f, dialect=csv.excel, encoding="utf-8", **kwds):
        f = UTF8Recoder(f, encoding)
        self.reader = csv.reader(f, dialect=dialect, **kwds)

    def next(self):
        row = self.reader.next()
        return [unicode(s, "utf-8") for s in row]

    def __iter__(self):
        return self


if __name__ == '__main__':
	#require
	table_adr = "table.csv"
	tag_adr = "tag_list"

	#[tag_list]
	#INSERT INTO `ezinstall`.`tag` (`id`,`name`)VALUES(NULL,'辦公');
	tag_output = ""
	tag_list = codecs.open( tag_adr, 'r', 'utf-8' ).readlines()
	for i in range(len(tag_list)):
		tag_list[i] = tag_list[i].strip(' \n')
		tag_output += "INSERT INTO `ezinstall`.`tag` (`id`,`name`)VALUES(NULL,'%s');\n" % tag_list[i]
	print "tag_list=",tag_list
	#print tag_list[0]
	#print tag_list[len(tag_list)-1]
	#print tag_output

	#[table]
	#INSERT INTO `ezinstall`.`list` (`id`,`name`,`pic`,`comment`,`operation`,`tag`)VALUES(NULL,'資料庫_Base','ooo-base.png','類似 Microsoft Access 的資料庫軟體，特別的是可以跨平台使用，並且符合 ODF 國際標準格式','apt-get install openoffice.org-base','1;');
	#SQL
	list_output = "";
	table_reader = UnicodeReader( open(table_adr, 'r'), delimiter=',', quotechar='"' )
	attribute_load = False
	#json
	id_count = 1
	item = []
	for row in table_reader:
		if row[0] == '':
			continue
		if row[0][0] == '#':
			continue
		if 	attribute_load==False : #一開始先把csv的第一行屬性讀進來
			attribute = row
			attribute_load = True
			#json
			item.append({});
		else:
			name, pic, comment, operation, tag, sh, ignore = row[0:]
			print "處理套件:",name,sh
			tag = tag.split(";")[:-1]
			tag2=""
			for ele in tag:
				#print '"'+ele+'"'
				tag2 += str(tag_list.index(ele.strip())+1)+";"
				
			#SQL
			list_output += "INSERT INTO `ezinstall`.`list` (`id`,`name`,`pic`,`comment`,`operation`,`tag`)VALUES(NULL,'%s','%s','%s','%s','%s');\n" % (name, pic, comment, operation, tag2)
		
			#json
			item.append( {'id':id_count, 'name':name, 'pic':pic, 'comment':comment, 'operation':operation, 'tag':tag2, 'sh':sh} )
			id_count += 1
	
	"""		
	#[output for SQL]
	print tag_output
	print list_output
	
	#[output for Json]
	print json.dumps(item)
	"""
	"""
	ex.
	item[0] = {}
	item[1]['id'] = 1
	item[1]['comment'] = i'm comment
	item[1]['name'] = openoffice
	"""
	
	#[output to list_json.py]
	tmp=""
	tmp+="# -*- encoding: utf-8 -*-\n"
	tmp+="import json\n"
	tmp+="def listJson():\n"
	tmp+="\tlist_json='"+json.dumps(item)+"'\n"
	tmp+="\treturn json.loads(list_json)"
	
	file = codecs.open("list_json.py", "w", "utf-8")
	file.write(tmp)
	file.close()
	
	print "輸出list_json.py成功, 已取代ezinstall/cgi-bin/list_json.py"
	os.system('mv -f ./list_json.py ../cgi-bin/')
	
	#[output to list.js]
	tag_list=['ALL']+tag_list
	tmp=""
	tmp+="var list = "+json.dumps(item)+"\n"
	tmp+="var tag_list="+json.dumps(tag_list)+"\n"
	file = codecs.open("list.js", "w", "utf-8")
	file.write(tmp)
	file.close()
	
	print "輸出list.js成功, 已取代ezinstall/js/list.js"
	os.system('mv -f ./list.js ../js/')

	#print "tag_list=",tag_list 
