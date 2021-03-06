import { RouteConfig } from 'vue-router';
import { routeDashGamesManageApiDataStorageItemsList } from './data-storage/items/list/list.route';
import { routeDashGamesManageApiDataStorageItemsView } from './data-storage/items/view/view.route';
import { routeDashGamesManageApiMods } from './mods/mods.route';
import { routeDashGamesManageApiOverview } from './overview/overview.route';
import { routeDashGamesManageApiScoreboardsList } from './scoreboards/list/list.route';
import { routeDashGamesManageApiScoreboardsScoresList } from './scoreboards/scores/list/list.route';
import { routeDashGamesManageApiScoreboardsScoreUser } from './scoreboards/scores/user/user.route';
import { routeDashGamesManageApiScoreboardsScoresView } from './scoreboards/scores/view/view.route';
import { routeDashGamesManageApiSettings } from './settings/settings.route';
import { routeDashGamesManageApiTrophies } from './trophies/trophies.route';

export const routeDashGamesManageApi: RouteConfig = {
	path: 'api',
	component: () => import(/* webpackChunkName: "routeDashGamesManageApi" */ './api.vue'),
	children: [
		routeDashGamesManageApiOverview,
		routeDashGamesManageApiTrophies,
		routeDashGamesManageApiDataStorageItemsList,
		routeDashGamesManageApiDataStorageItemsView,
		routeDashGamesManageApiScoreboardsList,
		routeDashGamesManageApiScoreboardsScoresList,
		routeDashGamesManageApiScoreboardsScoresView,
		routeDashGamesManageApiScoreboardsScoreUser,
		routeDashGamesManageApiMods,
		routeDashGamesManageApiSettings,
	],
};
