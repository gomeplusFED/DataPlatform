<template>
    <h3>
        <span class="small">地址：</span> 
        {{moduleName}}
        ->
        {{sonName}}
        ->
        {{apiTitle}}

        <strong v-if="add">添加</strong>
    </h3>
    
    <div>
        <div class="form-group">
            <span>前端路由:</span>
            <input type="text" readonly="readonly" class="form-control" v-model="path">
        </div>
        <div class="form-group">
            <span>标题:</span>
            <input type="text" v-model="apiTitle" class="form-control">
        </div>
        <div class="form-group">
            <span>已有文件:</span>
            <button class="btn btn-default disabled">
                {{filename + '.js'}}
            </button>
            <button class="btn btn-default disabled">
                {{filename + '.json'}}                
            </button>
        </div>
        <div class="form-group">
            <span>展示类型:</span>
            <select v-model="apiType">
                <option selected>table</option>
                <option>chart</option>
            </select>
        </div>
        <div class="form-group">
            <span>API地址:</span>
            <input type="text" v-model="apiRouter" class="form-control" placeholder="eg: /achievements/shopOne">
        </div>


        <h4>
            API参数配置
        </h4>
        <div class="form-group">
            <p>
                <strong>1.modelName</strong>
                <span class="small">(使用的表)</span>
            </p>
            <input type="text" class="form-control h-input">
            <button class="btn btn-default">+</button>
        </div>
        <div class="form-group">
            <p>
                <strong>2.系统默认平台</strong>
            </p>
            <label>
                <input type="checkbox">
                <span class="small">(一般默认false)</span>
            </label>
            
        </div>


        <div class="form-group">
            <button @click.prevent="save" class="btn-info btn">
                &nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;
            </button>
        </div>
    </div>
</template>

<script>
let Vue = require("Vue");
let utils=require("../utils");
let $   = require("jQuery");

module.exports = Vue.extend({
    data(){
        return {
            add         : false,
            moduleName  : "",
            sonName     : "",
            path        : "",   //前端访问路由
            filename    : "",   //对应的文件名
            apiTitle    : "",
            apiType    : "table",
            apiRouter      : "",
            index       : "",   //在Path,Routers数组中是第几个
            apiIndex    : "",   //api数组中是第几个
            ApiConfig   : {}
        }
    },
    methods : {
        save(){

        }
    },
    route : {
        data(transition){
            //解析url参数
            let params = this.$route.params;
            let sonIndex=params.sonIndex;
            let P_R = sonIndex.split("_")[1] == "p" ? "path" : "routers";
            this.index = sonIndex.split("_")[0];
            
            utils.wait("window.Result" , ()=>{
                try{
                    let obj = window.Result[params.id][P_R][this.index];
                    this.filename = window.Result[params.id].filename;
                    this.moduleName = window.Result[params.id].name;
                    this.sonName    = obj.name;
                    this.path       = obj.path;

                    if(params.index == "add"){
                        this.add = true;
                        this.apiTitle = "";
                        this.apiType  = "table";
                        this.apiRouter= "";
                    }else{
                        this.add = false;
                        this.apiIndex = params.index;
                        let apiObj = obj.defaultData[this.apiIndex];
                        this.apiTitle = apiObj.title;
                        this.apiType  = apiObj.type;
                        this.apiRouter= apiObj.query_api;
                    }
                }catch(e){
                    alert("路由参数不对");
                }
            });
        }
    }
});
</script>