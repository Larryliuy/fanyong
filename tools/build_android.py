# coding=UTF-8
import os
import config
import sys

platform = ""
if len(sys.argv) > 1:
    platform = sys.argv[1]

if platform != '':
    if platform in config.platformDatas:
#         themes = config.getThemes()
#         print(themes)
#         sys.exit()
        print("正在打包'" + platform + "'平台...===:" + sys.version)
        platformSource = config.getPlatformSource(platform)
        config.updateFile(config.myConfigFile, "let environment", "let environment = '" + platform +"'")
        os.system("node ../打包相关/resetPages.js")
        config.updateManifestJson(platform, 'android')
        os.system("cli open")
        os.system("cli user login --username " + config.uniappAccount +"  --password " + config.uniappPwd)
        os.system("cli pack --project " + config.projectName + " --platform android --safemode true --android.packagename "+ platformSource['androidPackagename'] +" --android.androidpacktype 0 --android.certalias "+ platformSource['androidCertalias'] +" --android.certfile "+ platformSource['androidCertfile'] +" --android.certpassword "+ platformSource['androidCertpassword'])
    else:
       print("当前没有'"+ platform +"'的配置数据,请到config.py中的platformDatas中配置对应平台数据")
else:
   print("编译失败,未带平台参数;例子: python build_android.py ja_pro")
