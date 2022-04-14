# coding=UTF-8
import os
import json
import io
#import execjs

rootPath = os.path.abspath(os.path.join(os.getcwd(), ".."))
uniappAccount = 'weizhuangtaba@gmail.com'
uniappPwd = 'Bebedon168'
projectName = 'tuishui'
h5Dist = '../unpackage/dist/build/*'
myConfigFile = '../myConfig.js'

platformDatas = {
    'ja_pro': { 'name': 'KRISTIINE', 'androidPackagename': 'com.foreigntrade.ja', 'iosBundle': 'com.TiineKris.App', 'iosCertpassword': '123'},
    'ko_pro': { 'name': 'MALL OF BERLIN', 'androidPackagename': 'com.foreigntrade.ko', 'iosBundle': 'com.foreigntrade.foreign', 'iosCertpassword': 'ayi654321'},
    'pa_pro': { 'name': 'Supremeship', 'androidPackagename': 'com.foreigntrade.pa', 'iosBundle': 'com.foreigntrade.foreign', 'iosCertpassword': 'ayi654321'},
    'sw_pro': { 'name': 'YunMeng', 'androidPackagename': 'com.foreigntrade.sw', 'iosBundle': 'com.foreigntrade.foreign', 'iosCertpassword': 'ayi654321'},
    'me_pro': { 'name': 'Steen & Strøm', 'androidPackagename': 'com.foreigntrade.me', 'iosBundle': 'com.foreigntrade.foreign', 'iosCertpassword': 'ayi654321'},
    'de_pro': { 'name': 'ATTICA', 'androidPackagename': 'com.foreigntrade.de', 'iosBundle': 'com.foreigntrade.foreign', 'iosCertpassword': 'ayi654321'},
    'mcl_pro': { 'name': 'Mercado Livre', 'androidPackagename': 'com.foreigntrade.mcl', 'iosBundle': 'com.foreigntrade.foreign', 'iosCertpassword': 'ayi654321'},
    'ps_pro': { 'name': 'PARKSON', 'androidPackagename': 'com.foreigntrade.ps', 'iosBundle': 'com.foreigntrade.foreign', 'iosCertpassword': 'ayi654321'},
}

def updateFile(file, key, new_str):
    file_data = ""
    with open(file, "r", encoding="utf8") as f:
        for line in f:
            if key in line:
                lineArr = line.split(key)
                line = lineArr[0] + new_str + '\n'
            file_data += line
    with open(file,"w", encoding="utf8") as f:
        f.write(file_data)

def getPlatformSource(platform):
    source = {}
    source['androidCertfile'] = rootPath + '/tools/platform/'+ platform +'/android/foreigntrade.keystore'
    source['androidCertpassword'] = 'bbbforeigntrade.168'
    source['androidCertalias'] = 'foreigntrade.keystore'
    source['androidPackagename'] = platformDatas[platform]['androidPackagename']

    source['iosCertfile'] = rootPath + '/tools/platform/'+ platform +'/ios/certfile.p12'
    source['iosProfile'] = rootPath + '/tools/platform/'+ platform +'/ios/profile.mobileprovision'
    source['iosCertpassword'] = platformDatas[platform]['iosCertpassword']
    source['iosBundle'] = platformDatas[platform]['iosBundle']
    return source

def updateManifestJson(platform, appType):
    jsonPath = '../manifest.json'
    #获取json里面数据
    with open(jsonPath, "r", encoding="utf-8-sig") as f:
        #定义为只读模型，并定义名称为f
        params = json.load(f)
        #项目名称
        params['name'] = platformDatas[platform]['name']
        params['h5']['title'] = platformDatas[platform]['name']
        if appType == 'ios':
            #ios storyboard
            #params['app-plus']['distribute']['splashscreen']['ios']['storyboard'] = 'tools/platform/'+ platform +'/ios/CustomStoryboard.zip'
            #ios 启动图
            params['app-plus']['distribute']['splashscreen']['ios']['iphone']['portrait-896h@2x'] = 'tools/platform/'+ platform +'/ios/loading_828$1792.png'
            params['app-plus']['distribute']['splashscreen']['ios']['iphone']['retina40'] = 'tools/platform/'+ platform +'/ios/loading_640$1136.png'
            params['app-plus']['distribute']['splashscreen']['ios']['iphone']['landscape-896h@2x'] = 'tools/platform/'+ platform +'/ios/loading_1792$828.png'
            params['app-plus']['distribute']['splashscreen']['ios']['iphone']['iphonex'] = 'tools/platform/'+ platform +'/ios/loading_1125$2436.png'
            params['app-plus']['distribute']['splashscreen']['ios']['iphone']['iphonexl'] = 'tools/platform/'+ platform +'/ios/loading_2436$1125.png'
            params['app-plus']['distribute']['splashscreen']['ios']['iphone']['retina55'] = 'tools/platform/'+ platform +'/ios/loading_1242$2208.png'
            params['app-plus']['distribute']['splashscreen']['ios']['iphone']['retina55l'] = 'tools/platform/'+ platform +'/ios/loading_2208$1242.png'
            params['app-plus']['distribute']['splashscreen']['ios']['iphone']['portrait-896h@3x'] = 'tools/platform/'+ platform +'/ios/loading_640$960.png'
            params['app-plus']['distribute']['splashscreen']['ios']['iphone']['retina47l'] = 'tools/platform/'+ platform +'/ios/loading_1334$750.png'
            params['app-plus']['distribute']['splashscreen']['ios']['iphone']['retina35'] = 'tools/platform/'+ platform +'/ios/loading_640$960.png'
            params['app-plus']['distribute']['splashscreen']['ios']['iphone']['retina47'] = 'tools/platform/'+ platform +'/ios/loading_750$1334.png'
            params['app-plus']['distribute']['splashscreen']['ios']['iphone']['retina40l'] = 'tools/platform/'+ platform +'/ios/loading_1136$640.png'
            params['app-plus']['distribute']['splashscreen']['ios']['iphone']['landscape-896h@3x'] = 'tools/platform/'+ platform +'/ios/loading_2688$1242.png'

            #icons appstore
            params['app-plus']['distribute']['icons']['ios']['appstore'] = 'tools/platform/'+ platform +'/icons/192x192.png'
            #icons iphone
            params['app-plus']['distribute']['icons']['ios']['iphone']['spotlight@3x'] = 'tools/platform/'+ platform +'/icons/120x120.png'
            params['app-plus']['distribute']['icons']['ios']['iphone']['spotlight@2x'] = 'tools/platform/'+ platform +'/icons/80x80.png'
            params['app-plus']['distribute']['icons']['ios']['iphone']['notification@3x'] = 'tools/platform/'+ platform +'/icons/60x60.png'
            params['app-plus']['distribute']['icons']['ios']['iphone']['notification@2x'] = 'tools/platform/'+ platform +'/icons/40x40.png'
            params['app-plus']['distribute']['icons']['ios']['iphone']['settings@3x'] = 'tools/platform/'+ platform +'/icons/87x87.png'
            params['app-plus']['distribute']['icons']['ios']['iphone']['settings@2x'] = 'tools/platform/'+ platform +'/icons/58x58.png'
            params['app-plus']['distribute']['icons']['ios']['iphone']['app@3x'] = 'tools/platform/'+ platform +'/icons/180x180.png'
            params['app-plus']['distribute']['icons']['ios']['iphone']['app@2x'] = 'tools/platform/'+ platform +'/icons/120x120.png'
            #icons ipad
            params['app-plus']['distribute']['icons']['ios']['ipad']['spotlight@2x'] = 'tools/platform/'+ platform +'/icons/80x80.png'
            params['app-plus']['distribute']['icons']['ios']['ipad']['spotlight'] = 'tools/platform/'+ platform +'/icons/40x40.png'
            params['app-plus']['distribute']['icons']['ios']['ipad']['notification@2x'] = 'tools/platform/'+ platform +'/icons/40x40.png'
            params['app-plus']['distribute']['icons']['ios']['ipad']['notification'] = 'tools/platform/'+ platform +'/icons/20x20.png'
            params['app-plus']['distribute']['icons']['ios']['ipad']['settings@2x'] = 'tools/platform/'+ platform +'/icons/58x58.png'
            params['app-plus']['distribute']['icons']['ios']['ipad']['settings'] = 'tools/platform/'+ platform +'/icons/29x29.png'
            params['app-plus']['distribute']['icons']['ios']['ipad']['app@2x'] = 'tools/platform/'+ platform +'/icons/152x152.png'
            params['app-plus']['distribute']['icons']['ios']['ipad']['app'] = 'tools/platform/'+ platform +'/icons/76x76.png'
            params['app-plus']['distribute']['icons']['ios']['ipad']['proapp@2x'] = 'tools/platform/'+ platform +'/icons/167x167.png'
        else:
            #android 启动图
            params['app-plus']['distribute']['splashscreen']['android']['xhdpi'] = 'tools/platform/'+ platform +'/android/loading_480$762.png'
            params['app-plus']['distribute']['splashscreen']['android']['hdpi'] = 'tools/platform/'+ platform +'/android/loading_720$1242.png'
            params['app-plus']['distribute']['splashscreen']['android']['xxhdpi'] = 'tools/platform/'+ platform +'/android/loading_1080$1882.png'
            #icons android
            params['app-plus']['distribute']['icons']['android']['hdpi'] = 'tools/platform/'+ platform +'/icons/72x72.png'
            params['app-plus']['distribute']['icons']['android']['xhdpi'] = 'tools/platform/'+ platform +'/icons/96x96.png'
            params['app-plus']['distribute']['icons']['android']['xxhdpi'] = 'tools/platform/'+ platform +'/icons/144x144.png'
            params['app-plus']['distribute']['icons']['android']['xxxhdpi'] = 'tools/platform/'+ platform +'/icons/192x192.png'
        dict = params
        #将修改后的内容保存在dict中
    #关闭json读模式
    f.close()
    #写入json文件
    with open(jsonPath,'w') as r:
		#定义为写模式，名称定义为r
        # print(dict)
        json.dump(dict,r)
        #将dict写入名称为r的文件中
    r.close()

def updatePagesJson(platform):
    jsonPath = '../pages.json'
    #获取json里面数据
    with open(jsonPath, "r", encoding="utf8") as f:
        #定义为只读模型，并定义名称为f
        params = json.load(f)
		# print(params)
        #项目名称
        params['pages'][''] = '规则'

        #主图色
        params['tabBar']['selectedColor'] = ''
        #启动图
        #params['app-plus']['distribute']['splashscreen']['android']['xhdpi'] = 'tools/platform/'+ platform +'/android/loading_480$762.png'
        #params['app-plus']['distribute']['splashscreen']['android']['hdpi'] = 'tools/platform/'+ platform +'/android/loading_720$1242.png'
        #params['app-plus']['distribute']['splashscreen']['android']['xxhdpi'] = 'tools/platform/'+ platform +'/android/loading_1080$1882.png'
        dict = params
        #将修改后的内容保存在dict中
    #关闭json读模式
    f.close()
    #写入json文件
    with open(jsonPath,'w', encoding="utf8") as r:
    #定义为写模式，名称定义为r
        json.dump(dict,r)
        #将dict写入名称为r的文件中
    r.close()

def getThemes():
    jsPath = '../colors/const.js'
    #获取json里面数据
    with io.open(jsPath, "r", encoding='utf8') as f:
        js_code = f.read()
       # context = execjs.compile(js_code)
        print(js_code)
    f.close()