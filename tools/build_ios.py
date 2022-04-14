# coding:UTF-8
import os
import config
import sys

platform = ""
if len(sys.argv) > 1:
    platform = sys.argv[1]

if platform != '':
    if config.platformDatas.has_key(platform):
        print "正在打包'" + platform + "'平台..."
        platformSource = config.getPlatformSource(platform)
        config.updateFile(config.myConfigFile, "let environment", "let environment = '" + platform +"'")
        os.system("node ../打包相关/resetPages.js")
        config.updateManifestJson(platform, 'ios')
        os.system("cli open")
        os.system("cli user login --username " + config.uniappAccount +"  --password " + config.uniappPwd)
        os.system("cli pack --project " + config.projectName + " --platform iOS --iscustom false --safemode true --ios.bundle "+ platformSource['iosBundle'] +" --ios.supporteddevice iPhone --ios.isprisonbreak false --ios.profile "+ platformSource['iosProfile'] +" --ios.certfile "+ platformSource['iosCertfile'] +" --ios.certpassword "+ platformSource['iosCertpassword'])
    else:
       print "当前没有'"+ platform +"'的配置数据,请到config.py中的platformDatas中配置对应平台数据"
else:
   print "编译失败,未带平台参数;例子: python build_ios.py ja_pro"
