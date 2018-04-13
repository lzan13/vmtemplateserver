#! /bin/zsh
# -------------------------------------
# VMServer 运行脚本
#
# Author: lzan13
# WebSite: http://melove.net
# -------------------------------------

cat ./data/files/shell_logo
echo ""

pm2 stop ecosystem.json
pm2 start ecosystem.json --env production