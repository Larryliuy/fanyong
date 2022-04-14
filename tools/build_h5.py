# coding:UTF-8
import os
import config
import sys
##^let environment = '.*'$
platform = ""
if len(sys.argv) > 1:
    platform = sys.argv[1]

if platform != '':
    print "正在打包'" + platform + "'平台..."
    os.system("rm -rf " + config.h5Dist)
    config.updateFile(config.myConfigFile, "let environment", "let environment = '" + platform +"'")
    os.system("cli open")
    os.system("cli user login --username " + config.uniappAccount +"  --password " + config.uniappPwd)
    os.system("cli publish --platform h5 --project " + config.projectName)
else:
   print "编译失败,未带平台参数;例子: python build_h5.py ja_pro"