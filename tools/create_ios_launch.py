# coding:UTF-8
import PIL.Image
#pip install Pillow
import config
import sys

platform = ""
if len(sys.argv) > 1:
    platform = sys.argv[1]

imgNames = [
    ((828,1792),"loading_828$1792.png"),
    ((1792,828),"loading_1792$828.png"),
    ((640,1136),"loading_640$1136.png"),
    ((1125,2436),"loading_1125$2436.png"),
    ((2436,1125),"loading_2436$1125.png"),
    ((1242,2208),"loading_1242$2208.png"),
    ((2208,1242),"loading_2208$1242.png"),
    ((640,960),"loading_640$960.png"),
    ((1334,750),"loading_1334$750.png"),
    ((750,1334),"loading_750$1334.png"),
    ((1136,640),"loading_1136$640.png"),
    ((2688,1242),"loading_2688$1242.png")
]

if platform != '':
    if config.platformDatas.has_key(platform):
        baseImg = './platform/'+ platform +'/start.png'
        im = PIL.Image.open(baseImg)
        i = 0
        for i in range(len(imgNames)):
            imt = im
            size = imgNames[i][0]
            name = imgNames[i][1]
            # 不拉伸截取
#             ratio = float(size[0]) / size[1]
#             if ratio < 1:
#                 bw = imt.size[0]
#                 bh = imt.size[1]
#                 ch = bw / ratio
#                 if ch > bh:
#                     cw = bh*ratio
#                     left = int((bw - cw) / 2)
#                     top = 0
#                     right = int((bw - cw) / 2) + cw
#                     bottom = bh
#                 else:
#                     left = 0
#                     top = int((bh - ch) / 2)
#                     right = bw
#                     bottom = int((bh - ch) / 2) + ch
#                 imt = imt.crop((left, top, right, bottom))

            imt_r = imt.resize(size,PIL.Image.ANTIALIAS)
            fileName = './platform/'+ platform +'/ios/' + name
            imt_r.save(fileName)
            print("生成图片:" + fileName)
            i = i+1
    else:
       print "当前没有'"+ platform +"'的配置数据,请到config.py中的platformDatas中配置对应平台数据"
else:
   print "生成失败;例子: python create_ios_launch.py ja_pro"