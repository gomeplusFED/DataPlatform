## 开发

* step1

    安装 `nodejs( >6.0 )`

* step2

    ```bash
    git clone https://github.com/gomeplusFED/DataPlatform
    cd DataPlatform
    npm install -d
    npm install gulp webpack -g
    ```

* step3 
    
    复制本地 db 文件

* step4
    
    ```bash
    # 获取所有 model
    node mapp.js

    # 实时打包静态文件
    cd static/ && gulp watch

    # 启动服务
    node app.js

    # 访问 7879 端口
    ```

* step5
    
    按功能从 `dev` 分支切出新分支进行开发，开发完成后合并到 `dev` 分支提交测试，测试完成后合并到 `master` 分支上线
