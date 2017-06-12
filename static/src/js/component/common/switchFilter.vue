<template>
    <div class="head">
        <h3>{{title}}</h3>
        <div class="filter">
            <div class="select" v-for="item in props.radios">
                <ul>
                    <li>
                        <label>{{item.title}}：</label>
                    </li>
                    <li v-for="g in item.group">
                        <input type="radio" v-model="item.value" :value="g.key" :id="g.key">
                        <label :for="g.key">{{g.title}}</label>
                    </li>
                </ul>
            </div>
        </div>
        <div class="switch">
            <!--<button :class="`btn btn-${type === 'detail' ? 'primary' : 'default'}`" @click="changeType('detail')">明细表</button>
            <button :class="`btn btn-${type === 'total' ? 'primary' : 'default'}`" @click="changeType('total')">统计表</button>-->
            <button v-for="(btnIndex, item) in props.btns" :class="`btn btn-${btnIndex === checkIndex ? 'primary' : 'default'}`" @click="changeType(btnIndex, item)">
                {{item.title}}
            </button>
            <button class="btn btn-default" @click="search">查询</button>
        </div>
    </div>
</template>

<script>
var eventBus = require('../support/event-bus.vue');
export default {
    data() {
        return {
            checkIndex: 0
        }
    },
    props: ['index', 'pageComponentsData', 'componentType', 'argvs', 'initData'],
    computed: {
        props() {
            return this.pageComponentsData[this.componentType]
        }
    },
    ready() {
        let index = this.props.defaultIndex || 0
        this.changeType(index, this.props.btns[index])
    },
    methods: {
        changeType(index, item) {
            this.checkIndex = index
            // dom
            $('.row').hide()
            item.group.forEach(x => {
                $('.row').eq(x).show()
            })
        },
        search() {
            this.props.radios.forEach(x => {
                eventBus.$emit('platformChange',x.value, x.key);
            })

        }
    }
}
</script>

<style lang="less" scoped>
.head {
    width: 100%;
    padding: 5px;
    margin-bottom: 10px;
    background: #f5f5f5;
    border: 1px solid #ddd;

    .filter {
        float: left;
        width: 70%;

        ul {
            li {
                float: left;
                margin-right: 5px;

                label {
                    font-weight: normal;
                }
            }
            &:after {
                display: block;
                content: '';
                clear: both;
            }
        }
    }

    .switch {
        float: left;
        
        .btn {
            margin-right: 5px;
        }
    }

    &:after {
        display: block;
        content: '';
        clear: both;
    }
}
</style>
