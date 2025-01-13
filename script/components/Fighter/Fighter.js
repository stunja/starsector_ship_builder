import ViewModel from "../../ViewModel";
import FightersView from "../../allViews/Fighters/FightersView";
import classNames from "../../helper/DomClassNames";

const EVENT_LISTENER_TARGET = {
	FIGHTER_SLOT: `.${classNames.fighterSlot}`,
};
const EVENT_LISTENER_TYPE = {
	CLICK: `click`,
};
export default class Fighters extends ViewModel {
	constructor(model) {
		super(model);
	}
	update() {
		this.#containerRender();
	}
	#containerRender() {
		FightersView.render(this.getUserShipBuild());
		FightersView.addClickHandler(
			EVENT_LISTENER_TARGET.FIGHTER_SLOT,
			EVENT_LISTENER_TYPE.CLICK,
			this.test
		);
	}
	test(btn) {
		console.log(btn);
	}
}
