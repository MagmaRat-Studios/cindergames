import { Component } from 'vue-property-decorator';
import { Api } from '../../../../../../../../../_common/api/api.service';
import { GameBuild } from '../../../../../../../../../_common/game/build/build.model';
import { GameBuildLaunchOption } from '../../../../../../../../../_common/game/build/launch-option/launch-option.model';
import { GamePackage } from '../../../../../../../../../_common/game/package/package.model';
import { GameRelease } from '../../../../../../../../../_common/game/release/release.model';
import { Growls } from '../../../../../../../../../_common/growls/growls.service';
import { ModalConfirm } from '../../../../../../../../../_common/modal/confirm/confirm-service';
import {
	BaseRouteComponent,
	RouteResolver,
} from '../../../../../../../../../_common/route/route-component';
import FormGameRelease from '../../../../../../../../components/forms/game/release/release.vue';
import { RouteStore, RouteStoreModule } from '../../../../manage.store';

@Component({
	name: 'RouteDashGamesManageGamePackageReleaseEdit',
	components: {
		FormGameRelease,
	},
})
@RouteResolver({
	deps: { params: ['packageId', 'releaseId'] },
	resolver: ({ route }) =>
		Api.sendRequest(
			'/web/dash/developer/games/releases/' +
				route.params.id +
				'/' +
				route.params.packageId +
				'/' +
				route.params.releaseId
		),
})
export default class RouteDashGamesManageGamePackageReleaseEdit extends BaseRouteComponent {
	@RouteStoreModule.State
	game!: RouteStore['game'];

	package: GamePackage = null as any;
	release: GameRelease = null as any;
	releases: GameRelease[] = [];
	builds: GameBuild[] = [];
	launchOptions: GameBuildLaunchOption[] = [];
	buildDownloadCounts: { [buildId: number]: number } = {};
	areBuildsLockedByJam = false;
	areWebBuildsLockedBySellable = false;

	get routeTitle() {
		if (this.game && this.package && this.release) {
			return this.$gettextInterpolate(
				'Edit Release %{ release } - %{ package } - %{ game }',
				{
					game: this.game.title,
					package: this.package.title || this.game.title,
					release: this.release.version_number,
				}
			);
		}
		return null;
	}

	routeResolved($payload: any) {
		this.package = new GamePackage($payload.package);
		this.release = new GameRelease($payload.release);
		this.releases = GameRelease.populate($payload.releases);
		this.builds = GameBuild.populate($payload.builds);
		this.launchOptions = GameBuildLaunchOption.populate($payload.launchOptions);

		this.buildDownloadCounts = $payload.buildDownloadCounts || {};
		// If the server has no build counts it returns an empty array instead of an empty object.
		// This is an issue with the backend not explicitly casting empty arrays to objects.
		if (Array.isArray(this.buildDownloadCounts)) {
			this.buildDownloadCounts = {};
		}

		// If the game was entered into a jam that locks its builds.
		this.areBuildsLockedByJam = $payload.areBuildsLockedByJam || false;
		this.areWebBuildsLockedBySellable = $payload.package.is_in_paid_sellable || false;
	}

	onSaved() {
		this.$router.push({
			name: 'dash.games.manage.game.packages.edit',
			params: {
				packageId: this.package.id + '',
			},
		});
	}

	async unpublishRelease(release: GameRelease) {
		const result = await ModalConfirm.show(
			this.$gettext('dash.games.releases.manage.unpublish_release_confirmation')
		);

		if (!result) {
			return;
		}

		await release.$unpublish(this.game);

		Growls.success(
			this.$gettext('dash.games.releases.manage.unpublish_release_growl'),
			this.$gettext('dash.games.releases.manage.unpublish_release_growl_title')
		);
	}

	async removeRelease(release: GameRelease) {
		const result = await ModalConfirm.show(
			this.$gettext('dash.games.releases.manage.remove_release_confirmation')
		);

		if (!result) {
			return;
		}

		await release.$remove(this.game);

		Growls.success(
			this.$gettext('dash.games.releases.manage.remove_release_growl'),
			this.$gettext('dash.games.releases.manage.remove_release_growl_title')
		);

		this.$router.push({
			name: 'dash.games.manage.game.packages.edit',
			params: {
				packageId: this.package.id + '',
			},
		});
	}
}
