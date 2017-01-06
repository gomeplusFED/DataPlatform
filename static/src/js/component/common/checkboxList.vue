<template>
    <label v-show="isShowAll">
        <input type="checkbox" @click="check(-1)" :checked="isAll"/>
        全部
    </label>
    <label v-for="(index,item) in list">
        <input type="checkbox" @click="check(index)" :checked="arr[index]" />
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
        check(index) {
            if (index === -1) {
                let state = !this.isAll;
                this.arr = this.arr.map(x => {
                    return x = state;
                })
            } else {
                this.arr[index] = !this.arr[index]
            }
            let temp = this.arr.map(x => {
                return x ? '1' : '0'
            }).join('');
            this.val = temp;
            this.$dispatch('checkboxChange' + (this.level || ''), this.obj || {}, this.val, index);
        }
    },
    computed: {
        isAll() {
            return !!this.arr.every(x => !!x)
        }
    },
    watch: {
        val(val) {
             this.arr = val.split('').map((x, i) => {
                return !!parseInt(x)
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