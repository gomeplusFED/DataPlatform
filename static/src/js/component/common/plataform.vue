<template>
	<div class="plataform" v-show="platafromData.show">
		<span>平台切换（默认IOS）：</span>
		<div class="btn-group" role="group" aria-label="...">
			<button type="button" class="btn btn-default" v-for="item in platafromData.list" @click="plataformLink(item)">{{item.name}}</button>
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
	data() {
		return {
			platafromData: {}
		};
	},
	ready() {
		eventBus.$on('globalPlataform', (data) => {
			this.platafromData = data;
		});
	},
	methods: {
		plataformLink(item) {
			this.$router.go({
				query: {
					global_plataform: item.key
				}
			});
			setTimeout(() => {
				var platform = utils.parseUrlQuery(this.$route.path).global_plataform;
				eventBus.$emit('platformChange', platform, this.platafromData.key);
			}, 1);
		}
	}
};
</script>
