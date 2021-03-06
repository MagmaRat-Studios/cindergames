import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { number } from '../../../../_common/filters/number';
import AppProgressBar from '../../../../_common/progress/bar/bar.vue';
import { AppTooltip } from '../../../../_common/tooltip/tooltip-directive';
import { User } from '../../../../_common/user/user.model';

@Component({
	components: {
		AppProgressBar,
	},
	directives: {
		AppTooltip,
	},
	filters: {
		number,
	},
})
export default class AppUserLevelWidget extends Vue {
	@Prop(User) user!: User;

	get tooltip() {
		return this.$gettextInterpolate('%{ percentage }% progress to next level', {
			percentage: this.user.level_next_percentage,
		});
	}
}
