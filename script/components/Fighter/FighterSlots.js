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
	#allFighters;
	#userShipBuild;
	constructor(model) {
		super(model);

		this.#fighterPopUp = new FighterPopUp(model);
	}
	#processData() {
		this.#allFighters = this.getDataState().allFighters;
		this.#userShipBuild = this.getUserShipBuild();
	}
	update() {
		// Assign Data
		this.#processData();
		// Render
		this.#fighterSlotsRender();
		// Listeners
		this.#fighterSlotsOpenPopUpEventListener();
	}
	#fighterSlotsRender() {
		return FightersView.render([this.#userShipBuild, this.#allFighters]);
	}
	#fighterSlotsOpenPopUpEventListener() {
		FightersView.addClickHandler(
			EVENT_LISTENER_TARGET.FIGHTER_SLOT,
			EVENT_LISTENER_TYPE.CLICK,
			this.#fighterPopUp.update
		);
	}
}
