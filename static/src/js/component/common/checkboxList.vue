<template>
    <label v-show="isShowAll">
        <input type="checkbox" @click="checkAll" v-model="isAll"/>
        全部
    </label>
    <label v-for="(index,item) in list">
        <input type="checkbox" v-model="arr[index]" />
        {{item}}
    </label>
</template>

<script>
export default {
    props: {
        isShowAll: {
            type: Boolean,
            default: true
        },
        level: String,
        obj: Object,
        list: Array,
        val: String,
        callback: Function
    },
    data() {
        return {
            arr: []
        }
    },
    created() {
        this.list.forEach((x, index) => {
            this.arr.push(false)
        })
        this.val = this.arr.map(x => {
            return x ? '1' : '0'
        }).join('');
    },
    methods: {
        checkAll() {
            let state = !this.isAll;
            this.arr = this.arr.map(x => {
               return x = state;
            })
        }
    },
    computed: {
        isAll() {
            return !!this.arr.every(x => !!x)
        }
    },
    watch: {
        arr(val) {
            let temp = val.map(x => {
                return x ? '1' : '0'
            }).join('');
            if (temp !== this.val) {
                this.val = temp;
            }
            this.$dispatch('checkboxChange' + (this.level || ''), this.obj || {}, this.val);
        },
        val(val) {
            this.arr = val.split('').map(x => {
                return !!parseInt(x);
            })
        }
    }
}
</script>

<style scoped>
label {
	margin: 0 5px 0 0;
}

label>input {
	margin: 0;
}
</style>