#!/bin/bash
wget -N 114.32.80.172/ezinstall/ez-ver 
diff ./ezinfo/ez-ver ./ez-ver
if [ $? == 1 ]; then

	zenity --question --text "目前ezinstall有新增加的更新項目，是否要進行更新?" --ok-label="更新" --cancel-label="不更新"
	if [ $? == 0 ]; then 
	gksu -m 更新ezinstall，請輸入密碼 ./ezinfo/ez-update.sh
	fi
else
	rm ez-ver
fi 
