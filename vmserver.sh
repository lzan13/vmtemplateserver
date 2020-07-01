#! /bin/bash
# -------------------------------------
# VMServer 运行脚本
#
# Author: lzan13
# WebSite: https://melove.net
# -------------------------------------

cat ./data/res/vmloft
echo ""

pm2 stop vmconfig.json
pm2 start vmconfig.json --env production
