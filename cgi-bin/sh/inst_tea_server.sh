#!/bin/bash
wget http://163.20.108.7/~es/lampp.tar
tar jxvpf lampp.tar -C /
if [ -e /usr/share/icons/ezgo ];then
    echo "已經有ezgo資料夾"
  else
     mkdir /usr/share/icons/ezgo
fi
    echo "拷貝icon進入資料夾"
    cp -a /opt/lampp/*.png /usr/share/icons/ezgo/
echo "建立桌面圖示"
cp -a /opt/lampp/*.desktop ~/桌面

  zenity --info \
        --text="教學伺服器安裝完成.可以執行桌面的程式.." \
        --title "教學伺服器程式安裝"
