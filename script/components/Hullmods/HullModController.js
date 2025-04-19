import ViewModel from "../../ViewModel";
import ShipStats from "../ShipStats/ShipStats";
import HullModsPopUp from "./HullModsPopUp";
import FighterSlots from "../Fighter/FighterSlots";
// View
import InstalledHullMods from "../../allViews/HullMods/InstalledHullModsView";
import HullModView from "../../allViews/HullMods/HullModView";
import BuildInHullModsView from "../../allViews/HullMods/BuildInHullModsView";
// Helper
import classNames from "../../helper/DomClassNames";
import { EVENT_LISTENER_TYPE } from "../../helper/MagicStrings";
import HullModHelper from "./HullModHelper";
import { updateUserShipBuildWithHullModLogic } from "../../helper/helperFunction";

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

		const updatedHullMods = HullModHelper.updateInstalledHullMod(
			hullmodId,
			userShipBuild,
			this.#allHullMods
		);

		this.setUpdateUserShipBuild({
			...updateUserShipBuildWithHullModLogic(
				{
					...userShipBuild,
					hullMods: updatedHullMods,
				},
				this._getBaseShipBuild()
			),
		});

		// Update shipStats to render new fields
		new ShipStats(this.getState()).update();

		// update fighterBays
		new FighterSlots(this.getState()).update();

		// Update the hullModController including render
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
