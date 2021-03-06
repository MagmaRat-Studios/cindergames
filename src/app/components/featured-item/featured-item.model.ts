import { Community } from '../../../_common/community/community.model';
import { Game } from '../../../_common/game/game.model';
import { Jam } from '../../../_common/jam/jam.model';
import { Model } from '../../../_common/model/model.service';

export class FeaturedItem extends Model {
	game?: Game;
	jam?: Jam;
	community?: Community;
	content!: string;
	back_url!: string;
	front_url!: string;
	posted_on!: number;
	custom_text!: string | null;
	custom_url!: string | null;

	constructor(data: any = {}) {
		super(data);

		if (data.game) {
			this.game = new Game(data.game);
		}

		if (data.jam) {
			this.jam = new Jam(data.jam);
		}

		if (data.community) {
			this.community = new Community(data.community);
		}
	}
}

Model.create(FeaturedItem);
