<style>
    .h-sidebar{
        width: 240px;
        float: left;
    }
    .abc{
        margin-left: 20px;
    }
</style>
<template>
    <section class="h-sidebar">
        <button @click="go">Click Me.</button>
        <strong>Count : {{count}}</strong>
        <hr>
        <a href="#!/Module">Go foo</a>
        <a href="#!/sonModule">go Bar</a>
        <a href="#!/apiModule">CCC</a>


        <p>================</p>
        <ul class="nav" id="side-menu">
            <li @click="go" v-for="(index , item) in result">
                <a href="#!/Module/{{index}}">
                    <i class="fa fa-rocket fa-fw"></i>
                    {{item.name}}
                    <span class="fa arrow"></span>
                </a>

                <ul v-if="item.path.length" class="nav collapse abc">
                    <li v-for="(sonIndex , sonItem) in item.path">
                        <a href="#!/sonModule/{{sonIndex}}">
                            <i class="fa fa-car fa-fw"></i>
                            {{sonItem.name}}
                            <span class="fa arrow"></span>
                        </a>
                           
                        <ul v-if="sonItem.defaultData.length" class="nav collapse abc">
                            <li v-for="api in sonItem.defaultData">
                                <a href="#!/apiModule">
                                    <i class="fa fa-fighter-jet fa-fw"></i>
                                    {{api.title}}
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </section>
    
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
        }
    },
    ready() {
        $.ajax({
            url : "/getConfig",
            dataType : "json",
            success(data){
                console.log(data);
                location.hash = "#!/";
                window.Result = data;
                Vue.set(Data , "result" , data);
                Vue.nextTick(()=>{
                    $('#side-menu').metisMenu({
                        preventDefault: false,
                        doubleTapToGo: true
                    });
                })
            }
        });
    }
});

        



module.exports = SideBar;
</script>