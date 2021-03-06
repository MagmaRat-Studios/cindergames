import { Api } from '../../../../_common/api/api.service';
import { Connection } from '../../../../_common/connection/connection-service';
import { BaseForm, FormOnInit, FormOnSubmit } from '../../../../_common/form-vue/form.service';
import { Component, Prop } from 'vue-property-decorator';

@Component({})
export default class FormResetPassword extends BaseForm<any> implements FormOnInit, FormOnSubmit {
	@Prop(Number) userId!: number;
	@Prop(String) token!: string;

	warnOnDiscard = false;

	readonly Connection = Connection;

	onInit() {
		this.setField('password', '');
	}

	onSubmit() {
		// Will return a bad request if the user ID or key is invalid. Since we
		// checked it in the route component, let's let it process the payload
		// and show an error page.
		return Api.sendRequest('/web/auth/reset-password/' + this.userId, {
			key: this.token,
			password: this.formModel.password,
		});
	}
}
