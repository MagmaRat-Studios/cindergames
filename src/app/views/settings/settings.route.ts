import { RouteConfig } from 'vue-router';

export const routeSettings: RouteConfig = {
	name: 'settings',
	path: '/settings',
	component: () => import(/* webpackChunkName: "routeSettings" */ './settings.vue'),
	meta: {
		availableOffline: true,
	},
};
