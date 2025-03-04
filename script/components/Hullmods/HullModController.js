import ViewModel from "../../ViewModel";
import classNames from "../../helper/DomClassNames";
// View
import InstalledHullMods from "../../allViews/HullMods/InstalledHullModsView";
import HullModView from "../../allViews/HullMods/HullModView";
import BuildInHullModsView from "../../allViews/HullMods/BuildInHullModsView";
// HullMods
import HullModsPopUp from "./HullModsPopUp";
// Helper
import { EVENT_LISTENER_TYPE } from "../../helper/MagicStrings";
import { updateInstalledHullMod } from "./HullModHelper";

const EVENT_LISTENER_TARGET = {
	HULLMODS: `.${classNames.hullMods__button}`,
	REMOVE_HULLMOD: `.${classNames.removeInstalledHullModButton}`,
};

const HULLMOD_BUTTON_TYPE = {
	OPEN: "open",
	SMODS: "smods",
};

export default class HullModController extends ViewModel {
	#userState;
	#allHullMods;
	#userShipBuild;

	#buildInHullMods;
	#hullSize;

	constructor(model) {
		super(model);

		this.#userState = this.getUserState();
		this.#allHullMods = this.#userState.usableHullMods;
		this.#userShipBuild = this.#userState.userShipBuild;
		this.#hullSize = this.#userShipBuild.hullSize;

		// this.#buildInHullMods = this.#createBuildInHullModsArray();
		this.#buildInHullMods = this.#userShipBuild.hullMods.builtInMods;
	}
	update() {
		this.#hullModContainerRender();
		this.#renderHullModContainer();

		this.#hullModContainerEventListener();
	}
	// Render
	#hullModContainerRender() {
		HullModView.render(this.#userShipBuild);
	}
	#renderHullModContainer() {
		BuildInHullModsView.render(this.#buildInHullMods);
		InstalledHullMods.render([this.getUserShipBuild(), this.#hullSize]);
	}

	// Use hullModId to fetch HullModObject and create and array
	// #createBuildInHullModsArray() {
	// 	try {
	// 		const allHullMods = this.#allHullMods;
	// 		const { builtInMods } = this.#userShipBuild.hullMods;
	// 		if (!allHullMods || !builtInMods) {
	// 			return [];
	// 		}
	// 		console.log(builtInMods);
	// 		const newArray = builtInMods
	// 			.map((buildInHullMod) =>
	// 				allHullMods.find((hullmod) => hullmod.id === buildInHullMod)
	// 			)
	// 			.filter(Boolean);

	// 		return builtInMods;
	// 	} catch (error) {
	// 		console.error("Error finding built-in hull mods:", error);
	// 		return [];
	// 	}
	// }
	#openHullModPopUp = (btn) => {
		const { hullmodButtonType } = btn.dataset;
		if (hullmodButtonType === HULLMOD_BUTTON_TYPE.OPEN) {
			new HullModsPopUp(this.getState());
		}
		if (hullmodButtonType === HULLMOD_BUTTON_TYPE.SMODS) {
			console.log("smods");
		}
	};
	#removeInstalledHullMod = (btn) => {
		if (!btn?.dataset?.hullmodId) {
			console.error("No hullmodId provided");
			return;
		}
		const { hullmodId } = btn.dataset;
		const userShipBuild = this.getUserShipBuild();

		const updatedHullMods = updateInstalledHullMod(
			hullmodId,
			userShipBuild,
			this.#allHullMods
		);

		this.setUpdateUserShipBuild({
			...this.#userShipBuild,
			hullMods: updatedHullMods,
		});

		this.update();
	};
	// Event Listeners
	#hullModContainerEventListener() {
		HullModView.addClickHandler(
			EVENT_LISTENER_TARGET.HULLMODS,
			EVENT_LISTENER_TYPE.CLICK,
			this.#openHullModPopUp
		);

		HullModView.addClickHandler(
			EVENT_LISTENER_TARGET.REMOVE_HULLMOD,
			EVENT_LISTENER_TYPE.CLICK,
			this.#removeInstalledHullMod
		);
	}
}
