import ViewModel from "../../ViewModel";
import classNames from "../../helper/DomClassNames";
// View
import InstalledHullMods from "../../allViews/HullMods/InstalledHullMods";
import HullModView from "../../allViews/HullMods/HullModView";
import BuildInHullModsView from "../../allViews/HullMods/BuildInHullModsView";
// HullMods
import HullModsPopUp from "./HullModsPopUp";
// Helper
import { EVENT_LISTENER_TYPE } from "../../helper/MagicStrings";

const EVENT_LISTENER_TARGET = {
	HULLMODS: `.${classNames.hullMods__button}`,
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

	constructor(model) {
		super(model);

		this.#userState = this.getUserState();
		this.#allHullMods = this.#userState.usableHullMods;
		this.#userShipBuild = this.#userState.userShipBuild;

		this.#buildInHullMods = this.#createBuildInHullModsArray();
	}
	update() {
		this.#hullModContainerRender();
		this.#hullModContainerEventListener();
		this.#renderHullMods();
	}
	// Container
	#hullModContainerRender() {
		HullModView.render(this.#userShipBuild);
	}
	#renderHullMods() {
		BuildInHullModsView.render(this.#buildInHullMods);
		InstalledHullMods.render(this.#createInstalledHullModsArray());
	}
	#createInstalledHullModsArray() {
		const allHullMods = this.#allHullMods;
		const { installedHullMods } = this.getUserShipBuild().hullMods;

		return installedHullMods
			.map((installedHullMod) =>
				allHullMods.find((hullmod) => hullmod.id === installedHullMod)
			)
			.filter(Boolean);
	}
	#createBuildInHullModsArray() {
		try {
			const allHullMods = this.#allHullMods;
			const { builtInMods } = this.#userShipBuild.hullMods;

			if (!allHullMods || !builtInMods) {
				return [];
			}

			return builtInMods
				.map((buildInHullMod) =>
					allHullMods.find((hullmod) => hullmod.id === buildInHullMod)
				)
				.filter(Boolean);
		} catch (error) {
			console.error("Error finding built-in hull mods:", error);
			return [];
		}
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
	// Event Listeners
	#hullModContainerEventListener() {
		HullModView.addClickHandler(
			EVENT_LISTENER_TARGET.HULLMODS,
			EVENT_LISTENER_TYPE.CLICK,
			this.#openHullModPopUp
		);
	}
}
