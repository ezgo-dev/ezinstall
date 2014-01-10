#!/bin/bash
mv ./ez-ver ./ezinfo/ez-ver
wget 163.20.108.30/ezinstall/ezupdate.tar
tar -jxvpf ./ezupdate.tar -C ./
rm ezupdate.tar
. ./ezinfo/ez-ver
zenity --info --text "$new"
