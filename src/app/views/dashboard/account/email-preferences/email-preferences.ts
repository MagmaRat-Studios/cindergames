import { Component } from 'vue-property-decorator';
import { Api } from '../../../../../_common/api/api.service';
import { BaseRouteComponent, RouteResolver } from '../../../../../_common/route/route-component';
import { Translate } from '../../../../../_common/translate/translate.service';
import { User } from '../../../../../_common/user/user.model';
import FormEmailPreferences from '../../../../components/forms/email-preferences/email-preferences.vue';
import { IntentService } from '../../../../components/intent/intent.service';
import { RouteStore, routeStore, RouteStoreModule } from '../account.store';

@Component({
	name: 'RouteDashAccountEmailPreferences',
	components: {
		FormEmailPreferences,
	},
})
@RouteResolver({
	deps: { query: ['intent'] },
	async resolver({ route }) {
		const intentRedirect = IntentService.checkRoute(route, {
			intent: 'unsubscribe',
			message: Translate.$gettext(`We have updated your email preferences.`),
		});
		if (intentRedirect) {
			return intentRedirect;
		}

		return Api.sendRequest('/web/dash/email-preferences');
	},
	resolveStore() {
		routeStore.commit('setHeading', Translate.$gettext(`dash.email_prefs.page_title`));
	},
})
export default class RouteDashAccountEmailPreferences extends BaseRouteComponent {
	@RouteStoreModule.State
	heading!: RouteStore['heading'];

	user: User = null as any;

	get routeTitle() {
		return this.heading;
	}

	routeResolved($payload: any) {
		this.user = new User($payload.user);
	}
}
