<?php
$mysql_host = "127.0.0.1"; //資料庫位址
$mysql_user = "root"; //帳號名稱
$mysql_password = "leoff9"; //密碼
$mysql_database = "ezinstall"; //資料庫名稱
if(mysql_connect($mysql_host, $mysql_user, $mysql_password))
{
	mysql_select_db($mysql_database);	mysql_query("set names 'UTF8';");
}
else
	echo "Die";
?>