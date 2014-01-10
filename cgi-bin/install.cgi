#!/usr/bin/python
# -*- encoding: utf-8 -*-

import sys
sys.path.append("./cgi-bin")
import list_json
"""
{
"comment": "\u985e\u4f3c Microsoft Access \u7684\u8cc7\u6599\u5eab\u8edf\u9ad4\uff0c\u7279\u5225\u7684\u662f\u53ef\u4ee5\u8de8\u5e73\u53f0\u4f7f\u7528\uff0c\u4e26\u4e14\u7b26\u5408 ODF \u570b\u969b\u6a19\u6e96\u683c\u5f0f", 
"name": "\u8cc7\u6599\u5eab_Base", 
"pic": "ooo-base.png", 
"tag": "1;", 
"operation": "openoffice.org-base", 
"id": 1
}
"""
import cgi
import codecs
import os



print """Content-Type: text/html
"""

form = cgi.FieldStorage()
#print form, "<br>"
#print form["installList"].value, "<br>"
#;2;4;67;8;  ;==%3B
#print form.getlist("installList"), "<br>"

list = list_json.listJson()
#print list[1]
#print list[1]["name"]

#sh_tmp是整個install會執行的sh
#sh_tmp2是針對不是以apt-get install安裝的套件, 要執行的指令
sh_tmp = u"#!/bin/bash\n"
sh_tmp += u"(\n"

sh_tmp += "echo "+os.path.abspath('./')+'\n'

#sh install
for id in form["installList"].value.split('a'):
	if( id ):
		id = int(id)
		if( list[id]['sh'] <> '' ):
			sh_tmp += codecs.open( './cgi-bin/sh/'+list[id]['sh'], 'r', "utf-8" ).read() + u'\n'

#apt-get install
sh_tmp += u"apt-get update\n"
sh_tmp += u"apt-get install "
for id in form["installList"].value.split('a'):
	if( id ):
		id = int(id)
		if( list[id]['sh'] == '' ):
			sh_tmp += list[id]['operation'] + " "
sh_tmp += u"""-y --force-yes\n"""
sh_tmp += u")"

sh_tmp += u""" | tee >(zenity --progress --pulsate --width=420 --text="程式安裝中,敬請稍候,請勿取消" --auto-close) && zenity --info --text "                安裝完成\n\n已安裝軟體會在下次啟動時偵測" """

sh = codecs.open("/tmp/ezinstall.sh", "w", "utf-8")
sh.write(sh_tmp)
sh.close()


#os.system( """gksu -m 請輸入您的密碼執行EZinstall安裝程式 "gnome-terminal -x /bin/bash /tmp/ezinstall.sh" """ )
os.system( """gksu -m 請輸入您的密碼執行EZinstall安裝程式 "konsole -e /bin/bash /tmp/ezinstall.sh" """ )
print """<script type="text/javascript">
window.open('', '_self', '');
window.close();
</script>"""
