## 所需环境

* node 版本 6.x 以上

* guvnor

* git

* npm

* gulp
  
## 部署步骤

* 合并所有功能代码到 `master` 分支  

* 拷贝相关文件到本地 `svn` 目录，并提交

* 到服务器上拉取 `svn` 代码

* 重启应用

## 所需全局依赖安装
  
* 安装guvnor：`npm install -g guvnor --unsafe-perm`  

* 安装gulp：`npm install -g gulp`  
  
## 启动程序、重启、删除
  
* 启动程序：`guv start -n dataPlatform /gomeo2o/www/DataPlatform/app.js`  

* 重启：`guv restart dataPlatform`  

* 删除：`guv remove dataPlatform`  

## 安装guvnor报错  
  
<a href="https://github.com/247521776/notes/tree/master/guvnor">相关报错解决方案</a>  
  