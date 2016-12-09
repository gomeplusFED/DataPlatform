<template>
    <h3>
        <span class="small">地址：</span> 
        {{moduleName}}
        ->
        {{sonName}}
        ->
        {{Api3.title}}

        <button v-if="add" class="btn btn-info">添加</button>
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
                {{Position.filename + '.js'}}
            </button>
            <button class="btn btn-default disabled">
                {{Position.filename + '.json'}}                
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
                <strong>3.排序order</strong>
            </p>
            <input v-for="(index , item) in ApiConfig.order" v-model="item" type="text" class="form-control h-input mr10" placeholder="请输入查询排序字段">
            <button @click="addInArr('order')" class="btn btn-default">+</button>
        </div>
        <div class="form-group">
            <p>
                <strong>4.系统默认平台选择</strong>
            </p>
            <label>
                <input v-model="ApiConfig.platform" type="checkbox">
                一般关闭
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
let i = 0;
let Reg = /模版/i;


module.exports = Vue.extend({
    data(){
        return {
            add         : false,
            moduleName  : "",
            sonName     : "",   //子模块名称
            path        : "",   //前端访问路由

            //config_add定位参数
            Position : {
                id : "",
                filename : "",    
                P_R: "", 
                //在Path,Routers数组中是第几个
                index:"",
                //api数组中是第几个
                index_default:"",
            },
            Api3        : {
                "type" : "table",
                "title": "",
                "query_api":"",
                "mark" : ""
            },
            ApiConfig   : {
                "modelName" : [""],
                "date_picker":true,
                "order"     : [""],
                "platform"  : false
            }
        }
    },
    methods : {
        addInArr(str){
            this.ApiConfig[str].push("模版"+i++);
        },
        save(){
            //过滤模版
            for(let key in this.ApiConfig){
                let value = this.ApiConfig[key];
                if(value instanceof Array){
                    let arr2  = [];
                    value.map((item , index)=>{
                        if(!Reg.test(item) && item){
                            arr2.push(item);
                        }
                    });
                    this.ApiConfig[key] = arr2;
                }
            }

            let _this = this;
            let Data = {
                Position : _this.Position,
                Api3     : _this.Api3,
                ApiConfig: _this.ApiConfig
            };
            
            $.ajax({
                url : "/mapi/setApi" , 
                type:"post",
                data: {
                    data : JSON.stringify(Data)
                },
                success(result){
                    if(result.state == 1){
                        alert(result.msg);
                    }
                    location.href = "/mapi/index";
                }
            });

        }
    },
    route : {
        data(transition){
            //解析url参数
            let params = this.$route.params;
            let sonIndex=params.sonIndex;

            this.Position.id = params.id;
            this.Position.P_R= sonIndex.split("_")[1] == "p" ? "path" : "routers";
            this.Position.index=sonIndex.split("_")[0];

            
            utils.wait("window.Result" , ()=>{
                let _this = this;
                try{
                    let obj = window.Result[this.Position.id][this.Position.P_R][this.Position.index];
                    this.Position.filename = window.Result[params.id].filename;
                    this.moduleName = window.Result[params.id].name;
                    this.sonName    = obj.name;
                    this.path       = obj.path;

                    if(params.index == "add"){
                        this.add = true;
                        this.Api3 = {
                            "type" : "table",
                            "title": "",
                            "query_api":"",
                            "mark" : +new Date()
                        };
                    }else{
                        this.add = false;
                        this.Position.index_default = params.index;
                        let apiObj = obj.defaultData[params.index];
                        this.$set("Api3" , apiObj);
                        //请求该文件数据
                        $.ajax({
                            url : "/mapi/apiConfig",
                            data : {
                                "filename" : this.Position.filename + ".json",
                                "mark" : this.Api3.mark
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