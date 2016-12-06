<template>
    <h3>
        左侧子模块 <strong v-if="add">添加</strong>
    </h3>
    <div>
        <div class="form-group">
            <span>左侧大模块名称:</span>
            <input type="text" class="form-control" v-model="fatherName" readonly="readonly">
        </div>
        <div class="form-group">
            <span>子模块名称:</span>
            <input type="text" class="form-control" v-model="sonName">
        </div>
        <div class="form-group">
            <span>已有文件:</span>
            <br>
            <button class="btn btn-default disabled">
                {{filename + '.js'}}
            </button>
            <button class="btn btn-default disabled">
                {{filename + '.json'}}                
            </button>
        </div>
        <div class="form-group">
            <span>前端访问路由:</span>(eg: /IM/index)
            <input type="text" class="form-control" v-model="path" placeholder="eg: /IM/index">
        </div>
        <div class="form-group">
            <span>模块类型</span>
            <select v-model="typeChoice" v-if="add">
                <option selected>path</option>
                <option>routers</option>
            </select>
            <input v-if="!add" type="text" readonly="readonly" class="form-control" v-model="typeChoice">
        </div>
        <div class="form-group">
            <button @click="save" class="btn-info btn">
                &nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;
            </button>
            <button @click="addSon" v-if="!add" @click="addSon" class="btn-info btn">
                添加子模块
            </button>
        </div>
    </div>
</template>

<script>
/**
 * 子模块界面
*/


let Vue = require("Vue");
let utils = require("../utils");
let $  = require("jQuery");


module.exports = Vue.extend({
    data(){
        return {
            add : false,
            id  : "",           //父级模块对应键名
            fatherName : "",    //父级模块名称
            sonName : "",       //子模块名称
            path  : "",
            type  : "",         //add  , change
            typeChoice:"",      //path , routeres
            index : "",         //数组中第几个
            filename: ""
        }
    },
    methods : {
        save(){
            let data = { id : this.id };
            if(!this.sonName){
                alert("请输入子模块名称");
                return;
            }
            if(!this.path){
                alert("请按规定格式输入前端匹配路径");
                return;
            }
            
            data.sonName = this.sonName;
            data.path    = this.path;
            data.P_R     = this.typeChoice;
            if(this.add){
                data.type = "add";                
            }else{
                data.type = "change";
                data.index = this.index;
            }

            //go ajax
            $.ajax({
                url : "/mapi/addSonModule",
                type: "post",
                data : data,
                success(result){
                    if(result.state){
                        alert(result.msg);
                        location.href = "/mapi/index";
                    }else{
                        alert(result.msg);
                    }
                }
            });
        },
        addSon(){
            location.hash = "#!/apiModule/" + this.id + "/" + this.$route.params.sonIndex + "/add";
        }
    },
    route : {
        data(transition){
            let params = this.$route.params,
                id     = this.id = params.id,
                sonIndex = params.sonIndex,
                P_R,
                index;

            utils.wait("window.Result" , () => {
                try{
                    this.fatherName = window.Result[id].name;
                    this.filename = window.Result[id].filename;
                    if(sonIndex == "add"){
                        this.add = true;
                        this.sonName = "";
                        this.path = "";
                    }else{
                        this.index = sonIndex.split("_")[0];
                        let P_R = sonIndex.split("_")[1] == "p" ? "path" : "routers";
                        let obj = window.Result[id][P_R][this.index];

                        this.add = false;
                        this.sonName = obj.name;
                        this.path    = obj.path;
                        this.typeChoice = P_R;
                    }                    
                }catch(e){
                    alert("路由参数不对");
                    // location.href = "/mapi/index";
                }
            })
        }
    }

});
</script>