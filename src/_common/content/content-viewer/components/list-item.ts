import Vue, { CreateElement } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { ContentObject } from '../../content-object';
import { ContentOwner } from '../../content-owner';
import { renderChildren } from './base-component';

@Component({})
export class AppContentViewerListItem extends Vue {
	@Prop(ContentObject)
	data!: ContentObject;
	@Prop(Object)
	owner!: ContentOwner;

	render(h: CreateElement) {
		return h('li', renderChildren(h, this.owner, this.data.content));
	}
}
