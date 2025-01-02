import ViewModel from "../ViewModel";
import AdditionalInfoView from "../allViews/AdditionalInfoView";

export default class AdditionalInfo extends ViewModel {
	constructor(model) {
		super(model);
	}
	update() {
		this.#containerRender();
	}
	#containerRender() {
		AdditionalInfoView.render(this.getState());
	}
}
