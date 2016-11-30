<style>
    .h-sidebar{
        width: 240px;
        float: left;
        background: #fff;
    }
    .abc{
        margin-left: 20px;
    }
</style>
<template>
    <aside class="h-sidebar">
        <button @click="go">Click Me.</button>
        <strong>Count : {{count}}</strong>
        <hr>
        <a href="#!/Module">Go foo</a>
        <a href="#!/sonModule">go Bar</a>
        <a href="#!/apiModule">CCC</a>


        <p>================</p>
        <ul class="nav" id="side-menu">
            <li v-for="(index , item) in result">
                <a @click.prevent="urlGo" href="#!/Module/{{index}}">
                    <i class="fa fa-rocket fa-fw"></i>
                    {{item.name}}
                    <span class="fa arrow"></span>
                </a>

                <ul v-if="item.path.length" class="nav collapse abc">
                    <li v-for="(sonIndex , sonItem) in item.path">
                        <a @click.prevent="urlGo" href="#!/sonModule/{{index}}/{{sonIndex}}">
                            <i class="fa fa-car fa-fw"></i>
                            {{sonItem.name}}
                            <span class="fa arrow"></span>
                        </a>
                           
                        <ul v-if="sonItem.defaultData.length" class="nav collapse abc">
                            <li v-for="(apiIndex , api) in sonItem.defaultData">
                                <a @click.prevent="urlGo" href="#!/apiModule/{{index}}/{{sonIndex}}/{{apiIndex}}">
                                    <i class="fa fa-fighter-jet fa-fw"></i>
                                    {{api.title}}
                                </a>
                            </li>

                            <li>
                                <a @click.prevent="urlGo" href="#!/apiModule/{{index}}/{{sonIndex}}/add">
                                    <i class="fa fa-arrows fa-fw"></i>
                                    添加一个api
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a @click.prevent="urlGo" href="#!/sonModule/{{index}}/add">
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
    count : 0,
    result : {}
}

const SideBar = Vue.extend({
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
            url : "/getConfig",
            dataType : "json",
            success(data){
                console.log(data);
                // location.hash = "#!/";
                window.Result = data;
                Vue.set(Data , "result" , data);
                Vue.nextTick(()=>{
                    $('#side-menu').metisMenu({
                        preventDefault: true,
                        // doubleTapToGo: true
                    });
                })
            }
        });
    }
});

        



module.exports = SideBar;
</script>