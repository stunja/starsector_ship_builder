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
import { removeInstalledHullMod } from "./HullModHelper";

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

		this.#buildInHullMods = this.#createBuildInHullModsArray();
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
		InstalledHullMods.render([
			this.#createInstalledHullModsArray(),
			this.#hullSize,
		]);
	}
	// Logic
	// Use hullModId to fetch HullModObject and create and array
	#createInstalledHullModsArray() {
		const allHullMods = this.#allHullMods;
		const { installedHullMods } = this.getUserShipBuild().hullMods;

		return installedHullMods
			.map((installedHullMod) =>
				allHullMods.find((hullmod) => hullmod.id === installedHullMod)
			)
			.filter(Boolean);
	}
	// Use hullModId to fetch HullModObject and create and array
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
	#removeInstalledHullMod = (btn) => {
		if (!btn?.dataset?.hullmodId) {
			console.error("No hullmodId provided");
			return;
		}
		const { hullmodId } = btn.dataset;
		const { hullMods } = this.getUserShipBuild();

		const updatedHullMods = removeInstalledHullMod(hullmodId, hullMods);

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
