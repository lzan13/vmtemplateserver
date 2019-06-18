#! /bin/bash
# -------------------------------------
# VMServer 运行脚本
#
# Author: lzan13
# WebSite: http://melove.net
# -------------------------------------

cat ./data/files/shell_logo
echo ""

pm2 stop vmconfig.json
pm2 start vmconfig.json --env production
