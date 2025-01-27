import ViewModel from "../../ViewModel";
import classNames from "../../helper/DomClassNames";
// View
import AddNewHullModView from "../../allViews/HullMods/AddNewHullModView";
import HullModView from "../../allViews/HullMods/HullModView";
import BuildInHullModsView from "../../allViews/HullMods/BuildInHullModsView";
// HullMods

import HullModsPopUp from "./HullModsPopUp";
//

const EVENT_LISTENER_TARGET = {
	HULLMODS: `.${classNames.hullMods__Button}`,
};
const EVENT_LISTENER_TYPE = {
	CLICK: `click`,
};
const HULLMOD_BUTTON_TYPE = {
	OPEN: "open",
	SMODS: "smods",
};

export default class HullModController extends ViewModel {
	#userState;
	#allHullMods;
	#userShipBuild;

	constructor(model) {
		super(model);

		this.#userState = this.getUserState();
		this.#allHullMods = this.#userState.usableHullMods;
		this.#userShipBuild = this.#userState.userShipBuild;
	}
	update() {
		this.#hullModContainerRender();
		this.#hullModContainerEventListener();
		this.#renderHullMods();
	}
	// Container
	#hullModContainerRender() {
		HullModView.render(this.getUserShipBuild());
	}
	#hullModContainerEventListener() {
		HullModView.addClickHandler(
			EVENT_LISTENER_TARGET.HULLMODS,
			EVENT_LISTENER_TYPE.CLICK,
			this.#openHullModPopUp
		);
	}

	#renderHullMods() {
		BuildInHullModsView.render([this.#userShipBuild, this.#allHullMods]);
	}
	#openHullModPopUp = (btn) => {
		const { hullmodButtonType } = btn.dataset;
		if (hullmodButtonType === HULLMOD_BUTTON_TYPE.OPEN) {
			new HullModsPopUp(this.getState());
		}
		if (hullmodButtonType === HULLMOD_BUTTON_TYPE.SMODS) {
			console.log("smods");
		}
	};
}
