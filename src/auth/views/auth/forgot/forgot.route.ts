import { RouteConfig } from 'vue-router';

export const routeAuthForgot: RouteConfig = {
	name: 'auth.forgot',
	path: '/forgot',
	component: () => import(/* webpackChunkName: "routeAuthForgot" */ './forgot.vue'),
	meta: {
		hideCoverImage: true,
	},
};
