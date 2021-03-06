import { Api } from '../../_common/api/api.service';
import { Site } from '../../_common/site/site-model';
import { SiteTemplate } from '../../_common/site/template/template-model';
import { SiteTheme } from '../../_common/site/theme/theme-model';
import { ThemeActions, ThemeMutations, ThemeStore } from '../../_common/theme/theme.store';
import { VuexAction, VuexModule, VuexMutation, VuexStore } from '../../utils/vuex';
import {
	Actions as AppActions,
	AppStore,
	appStore,
	Mutations as AppMutations,
} from '../../_common/store/app-store';

type Tab = 'theme' | 'editor';

export type Actions = AppActions &
	ThemeActions & {
		bootstrapTab: {
			tab: Tab;
			siteId: number;
		};
	};

export type Mutations = AppMutations &
	ThemeMutations & {
		_bootstrapTab: {
			tab: Tab;
			response: any;
		};
		setTemplateId: number;
		setThemeData: any;
		setContentEdited: void;
		clearIsDirty: void;
	};

@VuexModule({
	store: true,
	modules: {
		app: appStore,
		theme: new ThemeStore(),
	},
})
export class Store extends VuexStore<Store, Actions, Mutations> {
	app!: AppStore;
	theme!: ThemeStore;

	isLoaded = false;
	tab: Tab = 'theme';
	site: Site = null as any;
	siteTemplates: SiteTemplate[] = [];
	currentTemplateId = 0;
	siteTheme: SiteTheme = null as any;
	isDirty = false;

	@VuexAction
	async bootstrapTab({ tab, siteId }: Actions['bootstrapTab']) {
		const response = await Api.sendRequest(`/web/dash/sites/editor/${siteId}`);
		this._bootstrapTab({ tab, response });
	}

	@VuexMutation
	_bootstrapTab({ tab, response }: Mutations['_bootstrapTab']) {
		this.tab = tab;
		this.isLoaded = true;
		this.site = new Site(response.site);
		this.siteTemplates = SiteTemplate.populate(response.templates);

		if (this.site.theme) {
			this.currentTemplateId = this.site.theme.template.id;
			this.siteTheme = this.site.theme;
		}
	}

	@VuexMutation
	setTemplateId(id: Mutations['setTemplateId']) {
		this.currentTemplateId = id;
		this.isDirty = true;
	}

	@VuexMutation
	setThemeData(themeData: Mutations['setThemeData']) {
		this.siteTheme.data = themeData;
		this.isDirty = true;
	}

	@VuexMutation
	setContentEdited() {
		this.isDirty = true;
	}

	@VuexMutation
	clearIsDirty() {
		this.isDirty = false;
	}
}

export const store = new Store();
