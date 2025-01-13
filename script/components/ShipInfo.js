import ViewModel from "../ViewModel";
import ShipInfoView from "../allViews/Containers/ShipInfoContainerView";

export default class ShipInfo extends ViewModel {
	constructor(model) {
		super(model);
	}
	update() {
		this.#containerRender();
	}
	#containerRender() {
		ShipInfoView.render(this.getUserShipBuild());
	}
}
