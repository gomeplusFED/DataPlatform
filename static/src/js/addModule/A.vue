<template>
    <h3>
        左侧大模块 <strong v-if="add">添加</strong>
    </h3>
    
    <form>
        <div class="form-group">
            <span>
                模块名称：
            </span>
            <input v-model="name" type="text" class="form-control" placeholder="请输入模块名称">
        </div>
        <div class="form-group">
            <span>模块权限ID:</span>
            <input title="如需修改，请从代码中修改" class="form-control" type="text" readonly="readonly" v-model="id">        
        </div>
        <div class="form-group">
            <button @click.prevent="save" class="btn-info btn">
                保存
            </button>
        </div>
    </form>
</template>

<script>

/**
 * 大模块界面
*/

let Vue = require("Vue");
let $   = require("jQuery");

module.exports = Vue.extend({
    data(){
        return {
            add : false,
            name: "",
            id  : ""
        }
    },
    methods : {
        save(){
            let id = this.$route.params.id;
            // let type;
            // if(id == "add"){
            //     type = "add";
            // }else{
            //     type = "change";
            // }

            if(!this.name){
                alert("请输入模块名");
                return;
            }

            $.ajax({
                url : "/addBigModule",
                type: "post",
                dataType: "json",
                data : {
                    "type" : id == "add" ? "add" : "change",
                    "name" : this.name,
                    "id"   : id
                },
                success(result){
                    if(result.state){
                        location.href = "/addModule";
                    }else{
                        alert(result.msg);
                    }
                }
            });
        }
    },
    route : {
        data(transition){
            let id = this.$route.params.id;
            let _this = this;
            if(id == "add"){
                this.add = true;
                this.id  = "系统将自动分配权限值，如要修改请手动修改代码";
                this.name = "";
            }else{
                this.add = false;
                this.id  = id;
                
                if(window.Result){
                    try{
                        this.name = window.Result[id].name;
                    }catch(e){
                        alert("没有找到这个模块");
                        location.href = "/addModule#!/";
                    }
                    
                }else{
                    setTimeout(function(){
                        try{
                            _this.name = window.Result[id].name;
                        }catch(e){
                            alert("没有找到这个模块");
                            location.href = "/addModule#!/";
                        }
                    } , 500);
                }
            }
        }
    }
});
</script>