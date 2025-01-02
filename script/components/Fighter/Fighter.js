import ViewModel from "../../ViewModel";
import FightersView from "../../allViews/Fighters/FightersView";

export default class Fighters extends ViewModel {
	constructor(model) {
		super(model);
	}
	update() {
		this.#containerRender();
	}
	#containerRender() {
		FightersView.render(this.getUserShipBuild());
	}
}
