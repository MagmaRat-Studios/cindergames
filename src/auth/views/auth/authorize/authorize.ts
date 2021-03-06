import { Api } from '../../../../_common/api/api.service';
import { Auth } from '../../../../_common/auth/auth.service';
import { BaseRouteComponent, RouteResolver } from '../../../../_common/route/route-component';
import { Component } from 'vue-property-decorator';

@Component({
	name: 'RouteAuthAuthorize',
})
@RouteResolver({
	lazy: true,
	resolver({ route }) {
		const { userId, code, type } = route.params;
		return Api.sendRequest(`/web/auth/authorize/${userId}/${code}/${type}`);
	},
})
export default class RouteAuthAuthorize extends BaseRouteComponent {
	isSuccess = false;

	get routeTitle() {
		if (this.isRouteLoading) {
			return this.$gettext('Just one moment...');
		}

		if (this.isSuccess) {
			return this.$gettext('Redirecting...');
		}

		return this.$gettext('Invalid Authorization Code');
	}

	routeResolved($payload: any) {
		this.isSuccess = $payload.success;

		// Redirect them to onboarding.
		if (this.isSuccess) {
			Auth.redirectOnboarding();
		}
	}
}
