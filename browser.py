#!/usr/bin/env python
# -*- encoding: utf-8 -*-

import gtk, webkit
import sys
sys.path.append("./cgi-bin")
import list_json
import os


def checkInstalled(pak_name):
	ret = os.system('dpkg --get-selections '+pak_name+' | grep "install"')
	if ret == 0:
		ret = os.system('dpkg --get-selections '+pak_name+' | grep "deinstall"')
		if ret == 0:
			return False
		#installed
		return True
	else:
		#not install yet
		return False


def check():
	#把ezinstall 支援的軟體列表讀進來
	ezinstall_list = list_json.listJson()
	#print len(ezinstall_list)
	installed = [False] * len(ezinstall_list)

	"""
	#[測試有無安裝 ver A]: 快 但是有先安裝過再移除就會偵測成有安裝
	#把已安裝軟體的列表讀進來
	os.system( "dpkg -l | awk '{print $2}' > /tmp/ezinstall_installed.list" )
	installed_list = open("/tmp/ezinstall_installed.list","r").readlines()
	installed_list = installed_list[5:]
	

	#比對
	for line in installed_list :
		line = line[:-1]
		#print line
		for i in range( 1,len(ezinstall_list) ):
			if line == ezinstall_list[i]['operation']:
				installed[i] = True
				break
	
	"""
	#[測試有無安裝 ver B]: 準確 但是慢
	for i in range( 1,len(ezinstall_list) ):
		if checkInstalled( ezinstall_list[i]['operation'] ):
			#print ezinstall_list[i]['operation'], "installed"
			installed[i] = True
		else:
			pass
			#print ezinstall_list[i]['operation'], "not installed"
	
	
	#輸出
	output = ""
	for i in range( len(ezinstall_list) ):
		if installed[i]:
			#print ezinstall_list[i]['operation']
			output += "1"
		else:
			output += "0"

	return output




win = gtk.Window()
win.set_icon_from_file("ez-install.png")
win.set_title("ezinstall")
#win.set_size_request(940,650)
#win.set_default_size(940,650)
win.set_geometry_hints(min_width=940, min_height=650, max_width=940, max_height=10000)
win.set_position(gtk.WIN_POS_CENTER)
win.connect('destroy', lambda w: gtk.main_quit())

scroller = gtk.ScrolledWindow()
web = webkit.WebView()
web.open( "http://127.0.0.1:8000?installed="+check() )
#web.open("http://google.com.tw")
scroller.add(web)
win.add(scroller)

win.show_all()
gtk.main()
