import { CreateElement } from 'vue';
import { Component } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { Api } from '../../../../../../_common/api/api.service';
import { Growls } from '../../../../../../_common/growls/growls.service';
import {
	getLinkedAccountProviderDisplayName,
	LinkedAccount,
} from '../../../../../../_common/linked-account/linked-account.model';
import { BaseRouteComponent, RouteResolver } from '../../../../../../_common/route/route-component';
import { AppState, AppStore } from '../../../../../../_common/store/app-store';
import { YoutubeChannel } from '../../../../../../_common/youtube/channel/channel-model';

function constructUrl(baseUrl: string, route: Route) {
	let url = baseUrl + route.params.provider;
	let firstParam = true;

	for (const param of ['oauth_verifier', 'state', 'code']) {
		const value = route.query[param];
		if (value) {
			url += (firstParam ? '?' : '&') + param + '=' + value;
			firstParam = false;
		}
	}

	url += (firstParam ? '?' : '&') + 'resource=User';

	return url;
}

@Component({
	name: 'RouteDashAccountLinkedAccountsLinkCallback',
})
@RouteResolver({
	resolver({ route }) {
		let url;
		if (route.params.provider === LinkedAccount.PROVIDER_YOUTUBE_CHANNEL) {
			url =
				'/web/dash/linked-accounts/link-youtube-channel-callback/' +
				LinkedAccount.PROVIDER_YOUTUBE + // replace with actual youtube id for backend
				'?code=' +
				route.query.code +
				'&state=' +
				route.query.state;
		} else {
			url = constructUrl('/web/dash/linked-accounts/link-callback/', route);
		}

		// Force POST.
		return Api.sendRequest(url, {});
	},
})
export default class RouteDashAccountLinkedAccountsLinkCallback extends BaseRouteComponent {
	@AppState
	user!: AppStore['user'];

	routeResolved($payload: any) {
		if (!this.user) {
			return;
		}

		const provider = this.$route.params.provider;
		const providerName = getLinkedAccountProviderDisplayName(provider);
		if (!$payload.success) {
			switch ($payload.reason) {
				case 'account-taken':
					Growls.error(
						this.$gettextInterpolate(
							'This %{ provider } account is already linked to another Game Jolt account.',
							{
								provider: providerName,
							}
						)
					);
					break;

				case 'channel-taken':
					Growls.error(
						this.$gettext(
							'This YouTube channel is already linked to another Game Jolt account.'
						)
					);
					break;

				case 'no-channel':
					Growls.error(
						this.$gettext(
							'The selected Google account has no valid YouTube channel associated with it.'
						)
					);
					break;

				case 'not-public':
					Growls.error(this.$gettext('This YouTube channel is not public.'));
					break;

				case 'invalid-google-account':
					Growls.error(
						this.$gettext('This Google account does not support Sign Up with Google.')
					);
					break;

				default:
					Growls.error(
						this.$gettextInterpolate('Unable to link your %{ provider } account.', {
							provder: providerName,
						})
					);
					break;
			}
		} else {
			switch (provider) {
				case LinkedAccount.PROVIDER_TWITTER:
					{
						const account = new LinkedAccount($payload.account);
						Growls.success(
							this.$gettextInterpolate(
								'Your %{ provider } account (@%{ name }) has been linked.',
								{
									name: account.name,
									provider: providerName,
								}
							),
							this.$gettext('Account Linked')
						);
					}
					break;
				case LinkedAccount.PROVIDER_FACEBOOK:
				case LinkedAccount.PROVIDER_GOOGLE:
				case LinkedAccount.PROVIDER_TWITCH:
				case LinkedAccount.PROVIDER_TUMBLR:
					{
						const account = new LinkedAccount($payload.account);
						Growls.success(
							this.$gettextInterpolate(
								'Your %{ provider } account (%{ name }) has been linked.',
								{
									name: account.name,
									provider: providerName,
								}
							),
							this.$gettext('Account Linked')
						);
					}
					break;
				case LinkedAccount.PROVIDER_YOUTUBE_CHANNEL:
				case LinkedAccount.PROVIDER_YOUTUBE:
					{
						const channel = new YoutubeChannel($payload.channel);
						Growls.success(
							this.$gettextInterpolate(
								'Your YouTube channel (%{ title }) has been linked.',
								{
									title: channel.title,
								}
							),
							this.$gettext('YouTube Channel Linked')
						);
					}
					break;
			}
		}

		this.$router.push({
			name: 'dash.account.linked-accounts',
		});
	}

	render(h: CreateElement) {
		return h('div');
	}
}
