import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Api } from '../../../../_common/api/api.service';
import { Growls } from '../../../../_common/growls/growls.service';
import { SiteBuild } from '../../../../_common/site/build/build-model';
import { Site } from '../../../../_common/site/site-model';
import { AppTooltip } from '../../../../_common/tooltip/tooltip-directive';
import FormDashSiteBuild from '../../forms/site/build/build.vue';

@Component({
	components: {
		FormDashSiteBuild,
	},
	directives: {
		AppTooltip,
	},
})
export default class AppSitesManagePageStatic extends Vue {
	@Prop(Site) site?: Site;
	@Prop(Boolean) enabled?: boolean;
	@Prop(Boolean) templateEnabled?: boolean;

	get enableTooltip() {
		return this.templateEnabled
			? this.$gettext('This will disable your template and use your static build instead.')
			: undefined;
	}

	onBuildAdded(_model: SiteBuild, response: any) {
		if (!this.site) {
			Growls.error(this.$gettext(`Site is not active`));
			return;
		}

		// Only alert if they had a build previously and uploaded a new one.
		if (this.site.build) {
			Growls.success(
				this.$gettext(`Your new site build is now active.`),
				this.$gettext(`Site Updated`)
			);
		}

		this.site.assign(response.site);
	}

	async activateBuild() {
		if (!this.site || !this.site.build) {
			Growls.error(this.$gettext(`Site or build is not active`));
			return;
		}

		try {
			const response = await Api.sendRequest(
				`/web/dash/sites/activate-primary-build/${this.site.id}`,
				{},
				{ noErrorRedirect: true }
			);

			if (response.errors && response.errors.domain_in_use) {
				Growls.error(this.$gettext('Domain is already in use in another site.'));
				return;
			}

			if (response.site) {
				this.site.assign(response.site);
			}
		} catch (e) {
			console.error(e);
			Growls.error(this.$gettext(`Something went wrong.`));
		}
	}
}
