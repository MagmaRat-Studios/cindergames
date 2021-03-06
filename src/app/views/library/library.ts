import { BaseRouteComponent, RouteResolver } from '../../../_common/route/route-component';
import { User } from '../../../_common/user/user.model';
import { CreateElement } from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
	name: 'RouteLibrary',
})
@RouteResolver({
	deps: {},
	// Make sure the children know if we're logged in or not.
	resolver: () => User.touch(),
})
export default class RouteLibrary extends BaseRouteComponent {
	render(h: CreateElement) {
		return h('router-view');
	}
}
