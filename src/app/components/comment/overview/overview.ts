import Vue from 'vue';
import { Component, Inject, Prop, Watch } from 'vue-property-decorator';
import {
	Comment,
	getCommentBlockReason,
	getCommentModelResourceName,
} from '../../../../_common/comment/comment-model';
import {
	CommentStoreManager,
	CommentStoreManagerKey,
	CommentStoreModel,
	getCommentStore,
} from '../../../../_common/comment/comment-store';
import { DisplayMode } from '../../../../_common/comment/modal/modal.service';
import { CommentThreadModal } from '../../../../_common/comment/thread/modal.service';
import AppContentViewer from '../../../../_common/content/content-viewer/content-viewer.vue';
import AppFadeCollapse from '../../../../_common/fade-collapse/fade-collapse.vue';
import AppIllustration from '../../../../_common/illustration/illustration.vue';
import { Model } from '../../../../_common/model/model.service';
import AppUserCardHover from '../../../../_common/user/card/hover/hover.vue';
import AppUserAvatarImg from '../../../../_common/user/user-avatar/img/img.vue';
import AppUserVerifiedTick from '../../../../_common/user/verified-tick/verified-tick.vue';

@Component({
	components: {
		AppFadeCollapse,
		AppUserAvatarImg,
		AppUserCardHover,
		AppContentViewer,
		AppUserVerifiedTick,
		AppIllustration,
	},
})
export default class AppCommentOverview extends Vue {
	@Inject(CommentStoreManagerKey) commentManager!: CommentStoreManager;

	@Prop(Array)
	comments!: Comment[];

	@Prop(Model)
	model!: Model;

	@Prop(String)
	displayMode!: DisplayMode;

	get displayComments() {
		return this.comments.filter(c => getCommentBlockReason(c) === false);
	}

	get hasComments() {
		const store = getCommentStore(
			this.commentManager,
			getCommentModelResourceName(this.model),
			this.model.id
		);
		if (store instanceof CommentStoreModel) {
			return store.totalCount > 0;
		}
		// If we didn't get the store information yet, treat this as if it's loading in.
		return true;
	}

	get commentStoreDirtyState() {
		const store = getCommentStore(
			this.commentManager,
			getCommentModelResourceName(this.model),
			this.model.id
		);
		if (store instanceof CommentStoreModel) {
			return store.overviewNeedsRefresh;
		}
		return false;
	}

	@Watch('commentStoreDirtyState')
	reloadComments() {
		if (this.commentStoreDirtyState) {
			const store = getCommentStore(
				this.commentManager,
				getCommentModelResourceName(this.model),
				this.model.id
			);
			if (store instanceof CommentStoreModel) {
				store.overviewNeedsRefresh = false;
			}

			this.$emit('reload-comments');
		}
	}

	open(comment: Comment) {
		CommentThreadModal.show({
			model: this.model,
			commentId: comment.id,
			displayMode: this.displayMode,
		});
	}
}
