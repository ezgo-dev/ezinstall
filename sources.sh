#!/bin/bash
echo 'deb http://free.nchc.org.tw/ezgo-core/ ezgo-lucid main' >>/etc/apt/sources.list
gpg --keyserver pgp.mit.edu --recv-key DDB2EB2F; gpg -a --export DDB2EB2F | sudo apt-key add -
