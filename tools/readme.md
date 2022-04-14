### 打包说明
备注:需要打包h5版本的话,使用alpha版本的HBuilderX,例如:HBuilderX 3.3.7-alpha

### 环境变量配置
#### HBuilderX版本
ln -s /Applications/HBuilderX.app/Contents/MacOS/cli /usr/local/bin/cli
#### Alpha版本
ln -snf /Applications/HBuilderX-Alpha.app/Contents/MacOS/cli /usr/local/bin/cli

### 打包命令 (命令后带好平台关键key)
h5: python build_h5.py ja_pro 
android: python build_android.py ja_pro 
ios: python build_ios.py ja_pro 