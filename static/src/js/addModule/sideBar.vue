<style>
    .h-sidebar{
        width: 240px;
        float: left;
        background: #fff;
    }
    .abc{
        margin-left: 20px;
    }
    .sub-title{
        padding-left: 15px;
    }
</style>
<template>
    <aside class="h-sidebar">
        <ul class="nav" id="side-menu">
            <li v-for="(index , item) in result">
                <a @click.prevent="urlGo" href="#!/Module/{{index}}">
                    <i class="fa fa-rocket fa-fw"></i>
                    {{item.name}}
                    <span class="fa arrow"></span>
                </a>

                <ul v-if="item.path.length" class="nav collapse abc">
                    <li>
                        <h6 class="sub-title">Path部分</h6>
                    </li>
                    <li v-for="(sonIndex , sonItem) in item.path">
                        <a @click.prevent="urlGo" href="#!/sonModule/{{index}}/{{sonIndex}}_p">
                            <i class="fa fa-car fa-fw"></i>
                            {{sonItem.name}}
                            <span class="fa arrow"></span>
                        </a>
                           
                        <ul v-if="sonItem.defaultData.length" class="nav collapse abc">
                            <li v-for="(apiIndex , api) in sonItem.defaultData">
                                <a @click.prevent="urlGo" href="#!/apiModule/{{index}}/{{sonIndex}}_p/{{apiIndex}}">
                                    <i class="fa fa-fighter-jet fa-fw"></i>
                                    {{api.title}}
                                </a>
                            </li>

                            <li>
                                <a class="btn-success" @click.prevent="urlGo" href="#!/apiModule/{{index}}/{{sonIndex}}_p/add">
                                    <i class="fa fa-arrows fa-fw"></i>
                                    添加一个api
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a class="btn-info" @click.prevent="urlGo" href="#!/sonModule/{{index}}/add">
                            <i class="fa fa-arrows fa-fw"></i>
                            添加一个子模块
                        </a>
                    </li>
                </ul>
                

                <ul v-if="item.routers.length" class="nav collapse abc">
                    <li>
                        <h6 class="sub-title">Routers部分</h6>
                    </li>
                    <li v-for="(sonIndex , sonItem) in item.routers">
                        <a @click.prevent="urlGo" href="#!/sonModule/{{index}}/{{sonIndex}}_r">
                            <i class="fa fa-car fa-fw"></i>
                            {{sonItem.name}}
                            <span class="fa arrow"></span>
                        </a>
                           
                        <ul v-if="sonItem.defaultData.length" class="nav collapse abc">
                            <li v-for="(apiIndex , api) in sonItem.defaultData">
                                <a @click.prevent="urlGo" href="#!/apiModule/{{index}}/{{sonIndex}}_r/{{apiIndex}}">
                                    <i class="fa fa-fighter-jet fa-fw"></i>
                                    {{api.title}}
                                </a>
                            </li>

                            <li>
                                <a @click.prevent="urlGo" href="#!/apiModule/{{index}}/{{sonIndex}}_r/add">
                                    <i class="fa fa-arrows fa-fw"></i>
                                    添加一个api
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a class="btn-info" @click.prevent="urlGo" href="#!/sonModule/{{index}}/add">
                            <i class="fa fa-arrows fa-fw"></i>
                            添加一个子模块
                        </a>
                    </li>
                </ul>
            </li>
            <li>
                <a @click.prevent="urlGo" href="#!/Module/add">
                    <i class="fa fa-arrows fa-fw"></i>
                    添加一个大模块
                </a>
            </li>
        </ul>
    </aside>
    
</template>

<script>
let Vue = require("Vue");
let $   = require("jQuery");

let Data = {
    result : {}
}

let SideBar = Vue.extend({
    data(){
        return Data
    },
    methods : {
        go(){
            this.count++;
        },
        urlGo(event){
            location.hash = event.target.hash;
        }
    },
    ready() {
        $.ajax({
            url : "/mapi/getConfig",
            dataType : "json",
            success(data){
                console.log(data);
                window.Result = data;
                Vue.set(Data , "result" , data);
                Vue.nextTick(()=>{
                    $('#side-menu').metisMenu({
                        preventDefault: true,
                    });
                })
            }
        });
    }
});

        



module.exports = SideBar;
</script>