#!/bin/bash

#移動到ezinstall的資料夾
first=`echo $0 | head -c 1`
if [ $first == "/" ]; then 
	nowdir=$0
else
	nowdir=`pwd`/$0
fi
nowdir=`echo $nowdir | sed s/ezinstall.sh//`
cd $nowdir
echo "移動到$nowdir"

#檢測網路
ping -c 1 8.8.8.8
if [ $? == 0 ]; then
:<<COMMENT
	grep "^deb http://free.nchc.org.tw/ezgo-core/ ezgo-lucid main" /etc/apt/sources.list
	#檢測套件庫
	if [ $? == 1 ]; then
		gksu -m 偵測到您沒有ezgo套件庫來源,請輸入密碼,會自動幫你加入ezgo套件庫來源 ./sources.sh 
	fi
	#網路更新
:<<COMMENT
	wget -N 163.20.108.30/ezinstall/ez-ver 
	diff ./ezinfo/ez-ver ./ez-ver
	if [ $? == 1 ]; then
		zenity --question --text "目前ezinstall有新增加的更新項目，是否要進行更新?" --ok-label="更新" --cancel-label="不更新"
	if [ $? == 0 ]; then 
		gksu -m 更新ezinstall，請輸入密碼 ./ezinfo/ez-update.sh
	fi
	else
		rm ez-ver
	fi 	
COMMENT
	python server.py &
	server=$!  #抓python server.py的pid

	#gnome-terminal --disable-factory -x python browser.py
	konsole --nofork -e python browser.py
	kill $server
	echo "關閉server"

else
	zenity --info --text 網路未連線,請確定網路連線後重新執行
fi

