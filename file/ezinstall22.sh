#!/bin/bash
gksu -m 請輸入您的密碼執行EZinstall安裝程式 "dpkg --configure -a"
gksu -m 請輸入您的密碼執行EZinstall安裝程式 "apt-get install tuxtype -y --force-yes" | tee >(zenity --progress --pulsate --width=420 --text="程式下載安裝中,網路速度有所差異,敬請稍候" --auto-close) && zenity --info --text 安裝完成
