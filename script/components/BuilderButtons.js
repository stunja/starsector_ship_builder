import ViewModel from "../ViewModel";
import BuilderButtonsView from "../allViews/BuilderButtonsView";

export default class BuilderButtons extends ViewModel {
	constructor(model) {
		super(model);
	}
	update() {
		this.#containerRender();
	}
	#containerRender() {
		BuilderButtonsView.render(this.getUserShipBuild());
	}
}
