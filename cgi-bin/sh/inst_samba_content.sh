#!/bin/bash
sel_cont=$(zenity --list --text "請選擇連線方式" --column="連線方式" smb ftp )
if  [ "$sel_cont" == "smb" ]; then
  if [ -e /etc/init.d/smbd ]; then
        echo "已安裝smb服務"
  else
	apt-get install samba
  fi
fi
input=$(zenity --entry --text="輸入"$sel_cont"連線主機IP")
if [ -z $input ]; then
   zenity --info \
        --text="取消安裝......" \
        --title "網路磁碟程式安裝"
else
  if [ -e /usr/share/icons/ezgo ];then
     echo "/usr/share/icons裡已經有ezgo資料夾"
     else
     mkdir /usr/share/icons/ezgo
  fi
  echo "拷貝圖示檔...."
  cp smb.png /usr/share/icons/ezgo
  echo "建立桌面圖示..."
  echo "#!/usr/bin/env xdg-open" >$HOME/桌面/網路硬碟.desktop
  echo "[Desktop Entry]" >$HOME/桌面/網路硬碟.desktop
  echo "Comment[zh_TW]=網路硬碟" >>$HOME/桌面/網路硬碟.desktop
  echo "Comment=網路硬碟" >>$HOME/桌面/網路硬碟.desktop
  echo "Version=1.0" >>$HOME/桌面/網路硬碟.desktop
  echo "Type=Application" >>$HOME/桌面/網路硬碟.desktop
  echo "Terminal=false" >>$HOME/桌面/網路硬碟.desktop
  echo "Icon[zh_TW]=/usr/share/icons/ezgo/smb.png" >>$HOME/桌面/網路硬碟.desktop
  echo "Name[zh_TW]=網路硬碟" >>$HOME/桌面/網路硬碟.desktop
  echo "Name=網路芳鄰" >>$HOME/桌面/網路硬碟.desktop
  echo "Exec=dolphin "$sel_cont"://"$input >>$HOME/桌面/網路硬碟.desktop
  echo "Name=網路硬碟" >>$HOME/桌面/網路硬碟.desktop
  echo "Icon=/usr/share/icons/ezgo/smb.png" >>$HOME/桌面/網路硬碟.desktop
  chmod +x $HOME/桌面/網路硬碟.desktop
  if [ -e /etc/skel/桌面 ];then
     echo "/etc/skel裡有桌面資料夾"
     else
     mkdir /etc/skel/桌面 
  fi
  cp $HOME/桌面/網路硬碟.desktop /etc/skel/桌面
  zenity --info \
	--text="安裝完成..此檔案可以複製給其他帳戶使用...." \
	--title "網路磁碟程式安裝"
fi
