<template>
	<div class="plataform" v-show="platafromData.show">
		<span v-if="platafromData.name !== undefined">{{platafromData.name}}</span>
		<span v-else>平台切换：</span>
		<div class="btn-group" role="group" aria-label="...">
			<button type="button" :class="{'btn-primary': item.key === key}" class="btn btn-default" v-for="item in platafromData.list" @click="plataformLink(item)">{{item.name}}</button>
		</div>
	</div>
</template>
<style scoped>
.plataform {
	margin-bottom: 20px;
}

.plataform span {
	font-size: 22px;
	display: inline-block;
	vertical-align: middle;
	font-weight: 600;
}
</style>
<script>
import eventBus from '../support/event-bus.vue';
import utils from 'utils';
export default {
	name: 'plataform',
	props: {
		index: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			platafromData: {},
			key: ''
		};
	},
	ready() {
		eventBus.$on('globalPlataform' + this.index, (data) => {
			this.platafromData = data;
			if (this.platafromData.list && this.platafromData.list.length) {
				let curQuery = utils.parseUrlQuery(this.$route.path);
				let check = curQuery[this.platafromData.key]
				if (check) {
					this.key = check
				} else {
					this.key = this.platafromData.list[0].key;
				}
			}
		});
	},
	methods: {
		plataformLink(item) {
			if (item.url) {
                console.log()
				location.href = item.url;
				return;
			}
			this.key = item.key;
			let key = this.platafromData.key;
			let curQuery = utils.parseUrlQuery(this.$route.path);
			curQuery[key] = item.key;
			this.$router.go({
				query: curQuery
			});
			setTimeout(() => {
				var platform = utils.parseUrlQuery(this.$route.path)[key];
				eventBus.$emit('platformChange', platform, key);
			}, 0);
		}
	}
};
</script>
