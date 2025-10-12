import ViewModel from "../../ViewModel";
import FighterPopUp from "./FighterPopUp";
// Views
import FightersView from "../../allViews/Fighters/FightersView";
// Helper
import CLASS_NAMES from "../../helper/ui/class_names";

const EVENT_LISTENER_TARGET = {
	FIGHTER_SLOT: `.${CLASS_NAMES.fighterSlot}`,
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
	async update() {
		// Assign Data
		this.#processData();
		// Render
		await this.#fighterSlotsRender();
		// Listeners
		this.#fighterSlotsOpenPopUpEventListener();
	}
	async #fighterSlotsRender() {
		return await FightersView.renderAsync([
			this.#userShipBuild,
			this.#allFighters,
		]);
	}
	#fighterSlotsOpenPopUpEventListener() {
		FightersView.addClickHandler(
			EVENT_LISTENER_TARGET.FIGHTER_SLOT,
			EVENT_LISTENER_TYPE.CLICK,
			this.#fighterPopUp.update
		);
	}
}
