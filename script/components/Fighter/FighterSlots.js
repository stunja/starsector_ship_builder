import ViewModel from "../../ViewModel";
import FighterPopUp from "./FighterPopUp.js/FighterPopUp";
// Views
import FightersView from "../../allViews/Fighters/FightersView";
// Helper
import classNames from "../../helper/DomClassNames";

const EVENT_LISTENER_TARGET = {
	FIGHTER_SLOT: `.${classNames.fighterSlot}`,
};
const EVENT_LISTENER_TYPE = {
	CLICK: `click`,
};

export default class FighterSlots extends ViewModel {
	#fighterPopUp;
	constructor(model) {
		super(model);

		this.#fighterPopUp = new FighterPopUp(model);
	}
	update() {
		// Render
		this.#fighterSlotsRender();
		// Listeners
		this.#fighterSlotsOpenPopUpEventListener();
	}
	#fighterSlotsRender() {
		FightersView.render(this.getUserShipBuild());
	}
	#fighterSlotsOpenPopUpEventListener() {
		FightersView.addClickHandler(
			EVENT_LISTENER_TARGET.FIGHTER_SLOT,
			EVENT_LISTENER_TYPE.CLICK,
			this.#fighterPopUp.update
		);
	}
}
