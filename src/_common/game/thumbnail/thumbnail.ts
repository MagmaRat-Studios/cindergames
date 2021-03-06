import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
import AppGamePlaylistAddToWidget from '../../../app/components/game-playlist/add-to-widget/add-to-widget.vue';
import AppGameCompatIcons from '../../../app/components/game/compat-icons/compat-icons.vue';
import AppGameFollowWidget from '../../../app/components/game/follow-widget/follow-widget.vue';
import AppGameModLinks from '../../../app/components/game/mod-links/mod-links.vue';
import { currency } from '../../filters/currency';
import AppPopper from '../../popper/popper.vue';
import { Screen } from '../../screen/screen-service';
import { ScrollInviewConfig } from '../../scroll/inview/config';
import { AppScrollInview } from '../../scroll/inview/inview';
import { SettingAnimatedThumbnails } from '../../settings/settings.service';
import { AppStore } from '../../store/app-store';
import AppUserCardHover from '../../user/card/hover/hover.vue';
import AppUserAvatarImg from '../../user/user-avatar/img/img.vue';
import AppUserVerifiedTick from '../../user/verified-tick/verified-tick.vue';
import { Game } from '../game.model';
import AppGameThumbnailImg from '../thumbnail-img/thumbnail-img.vue';

const InviewConfig = new ScrollInviewConfig({ margin: `${Screen.height}px` });

@Component({
	components: {
		AppGameThumbnailImg,
		AppGameCompatIcons,
		AppPopper,
		AppGameModLinks,
		AppUserCardHover,
		AppUserAvatarImg,
		AppScrollInview,
		AppGameFollowWidget,
		AppGamePlaylistAddToWidget,
		AppUserVerifiedTick,
	},
})
export default class AppGameThumbnail extends Vue {
	@Prop(Object)
	game!: Game;

	@Prop(String)
	linkTo?: string;

	@Prop(Boolean)
	hidePricing?: boolean;

	@Prop(Boolean)
	hideControls?: boolean;

	@State
	app!: AppStore;

	isBootstrapped = GJ_IS_SSR;
	isHydrated = GJ_IS_SSR;
	readonly InviewConfig = InviewConfig;
	readonly Screen = Screen;
	readonly Game = Game;

	get shouldShowControls() {
		// Only show controls if they didn't override with their own.
		return !this.$slots.default && !this.hideControls;
	}

	get shouldAnimate() {
		return SettingAnimatedThumbnails.get() && this.isHydrated;
	}

	get url() {
		if (this.linkTo === 'dashboard') {
			return this.game.getUrl('dashboard');
		} else if (this.linkTo) {
			return this.linkTo;
		}

		return this.game.getUrl();
	}

	get isOwned() {
		return this.game.sellable && this.game.sellable.is_owned;
	}

	get sellableType() {
		return this.game.sellable && this.game.sellable.type;
	}

	get pricing() {
		if (this.game.sellable && Array.isArray(this.game.sellable.pricings)) {
			return this.game.sellable.pricings[0];
		}
	}

	get saleOldPricing() {
		if (this.game.sellable && Array.isArray(this.game.sellable.pricings)) {
			return this.game.sellable.pricings[1];
		}
	}

	get sale() {
		return this.pricing && this.pricing.promotional;
	}

	get salePercentageOff() {
		if (this.pricing && this.saleOldPricing) {
			return (
				((this.saleOldPricing.amount - this.pricing.amount) / this.saleOldPricing.amount) *
				100
			).toFixed(0);
		}
		return '';
	}

	get pricingAmount() {
		return this.pricing && currency(this.pricing.amount);
	}

	get oldPricingAmount() {
		return this.saleOldPricing && currency(this.saleOldPricing.amount);
	}

	get showModTools() {
		return this.app.user && this.app.user.isMod && !this.hideControls;
	}

	inView() {
		this.isBootstrapped = true;
		this.isHydrated = true;
	}

	outView() {
		this.isHydrated = false;
	}
}
