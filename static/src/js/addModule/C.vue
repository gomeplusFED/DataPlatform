<template>
    <h3>
        <span class="small">地址：</span> 
        {{moduleName}}
        ->
        {{sonName}}
        ->
        {{Api3.apiTitle}}

        <strong v-if="add">添加</strong>
    </h3>
    
    <div>
        <div class="form-group">
            <span>前端路由:</span>
            <input type="text" readonly="readonly" class="form-control" v-model="path">
        </div>
        <div class="form-group">
            <span>标题:</span>
            <input type="text" v-model="Api3.title" class="form-control">
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
            <select v-model="Api3.type">
                <option selected>table</option>
                <option>chart</option>
            </select>
        </div>
        <div class="form-group">
            <span>API地址:</span>
            <input type="text" v-model="Api3.query_api" class="form-control" placeholder="eg: /achievements/shopOne">
        </div>
        
        <!-- ======== API参数配置 ========== -->

        <h4>
            API参数配置
        </h4>
        <div class="form-group">
            <p>
                <strong>1.modelName</strong>
                <span class="small">(使用的表,超出一个时请手动添加)</span>
            </p>
            <input type="text" class="form-control h-input mr10" v-for="item in ApiConfig.modelName" v-model="item" placeholder="请输入模型名称">
            <button @click="addInArr('modelName')" class="btn btn-default">+</button>
        </div>
        <div class="form-group">
            <p>
                <strong>2.日期选择组件</strong>
            </p>
            <label>
                <input v-model="ApiConfig.date_picker" type="checkbox">
                展示(date_picker)
            </label>
            <span class="small">
                其它字段,showDayUnit:true,date_picker_data:1
            </span>
        </div>
        <div class="form-group">
            <p>
                <strong>3.分页paging</strong>
                <span class="small">(多个表时手动添加)</span>
            </p>
            <label class="mr10" v-for="item in ApiConfig.paging">
                <input v-model="item" type="checkbox">
                第{{$index+1}}个表是否分页
            </label>
            <button @click="addInArr('paging')" class="btn btn-default">+</button>
        </div>
        <div class="form-group">
            <p>
                <strong>4.排序order</strong>
            </p>
            <input v-for="(index , item) in ApiConfig.order" v-model="item" type="text" class="form-control h-input mr10" placeholder="请输入查询排序字段">
            <button @click="addInArr('order')" class="btn btn-default">+</button>
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
let i = 0;


module.exports = Vue.extend({
    data(){
        return {
            add         : false,
            moduleName  : "",
            sonName     : "",
            path        : "",   //前端访问路由
            filename    : "",   //对应的文件名
            index       : "",   //在Path,Routers数组中是第几个
            apiIndex    : "",   //api数组中是第几个
            Api3        : {
                "type" : "table",
                "title": "",
                "query_api":""
            },
            ApiConfig   : {
                "modelName" : [""],
                "date_picker":true,
                "paging"    : [true],
                "order"     : [""]
            }
        }
    },
    methods : {
        addInArr(str){
            this.ApiConfig[str].push("模版"+i++);
        },
        save(){
            console.log("out data");
            console.log(this.Api3);
            console.log(this.ApiConfig);
            //clear the data.
            for(let key in this.ApiConfig){
                let value = this.ApiConfig[key];
                if(value instanceof Array){
                    value.map((index , item)=>{
                        console.log(index , item);
                    })
                }
            }
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
                let _this = this;
                try{
                    let obj = window.Result[params.id][P_R][this.index];
                    this.filename = window.Result[params.id].filename;
                    this.moduleName = window.Result[params.id].name;
                    this.sonName    = obj.name;
                    this.path       = obj.path;

                    if(params.index == "add"){
                        this.add = true;
                        this.Api3 = {
                            "type" : "table",
                            "title": "",
                            "query_api":""
                        };
                    }else{
                        this.add = false;
                        this.apiIndex = params.index;
                        let apiObj = obj.defaultData[this.apiIndex];
                        this.$set("Api3" , apiObj);
                        //请求该文件数据
                        $.ajax({
                            url : "/mapi/apiConfig",
                            data : {
                                "filename" : this.filename + ".json",
                                "query_api" : this.Api3.query_api
                            },
                            success(data){
                                if(data.state == 0){
                                    alert("error");
                                    return;
                                }

                                _this.$set('ApiConfig', data.result);

                            }
                        })
                    }
                }catch(e){
                    alert("路由参数不对");
                }
            });
        }
    }
});
</script>