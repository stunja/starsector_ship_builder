import ViewModel from "../../ViewModel";
import TablePopUpSorter from "../TablePopUpSorter";
import FighterSlots from "./FighterSlots";
import ShipStats from "../ShipStats/ShipStats";
import HullModController from "../Hullmods/HullModController";
// View
import FighterPopUpContainerView from "../../allViews/Fighters/FighterPopUpContainerView";
import FighterPopUpTableHeaderView from "../../allViews/Fighters/FighterPopUpTableHeaderView";
import FighterPopUpTableView from "../../allViews/Fighters/FighterPopUpTableView";
import FighterPopUpHoverView from "../../allViews/Fighters/FighterPopUpHoverView";
// Helper
import {
	weaponSlotIdIntoWeaponSlotObject,
	AddRemoveInstalledWeapon,
	pushTargetWeaponObjectOnTop,
	toggleAsyncSpinner,
} from "../../helper/helper_functions";

import CLASS_NAMES from "../../helper/ui/class_names";
import UpdateUserShipBuild from "../../helper/UpdateUserShipBuild";

//
const EVENT_LISTENER_TARGET = {
	TABLE_ENTRIES: `.${CLASS_NAMES.tableEntries}`,
	TABLE_HEADER_ENTRY: `.${CLASS_NAMES.tableHeaderEntry}`,
};

const EVENT_LISTENER_TYPE = {
	CLICK: "click",
	HOVER: "mouseover",
};

const TABLE_POPUP_TYPE = "fighterPopUpTable";

const SKIP_SORT_CATEGORY = {
	icon: "icon",
	description: "description",
};

export default class FighterPopUp extends ViewModel {
	#state;

	// ShipBuild
	#userShipBuild;
	#installedWeapons;
	#weaponsSlots;

	#getDataState;
	#weaponSlot;

	// Fighter Object which can be shown to user
	#currentFighterArray;
	#currentlyHoveredFighter;

	constructor(model) {
		super(model);
	}
	#updateData() {
		this.#state = this.getState();
		this.#getDataState = this.#state.dataState;

		this.#userShipBuild = this.getUserShipBuild();
		this.#installedWeapons = this.#userShipBuild.installedWeapons;
		this.#weaponsSlots = this.#userShipBuild.weaponSlots;
	}
	#updateOtherComponents() {
		// Update shipStats to render new fields
		new ShipStats(this.getState()).update();

		//! Why is this here?
		// Update Controller, to display installedHullMods
		new HullModController(this.getState()).update();
	}
	update = (btn) => {
		if (!btn) return;

		this.#updateData();

		this.#weaponSlot = weaponSlotIdIntoWeaponSlotObject(
			this.#weaponsSlots,
			btn.dataset.fighterId
		);

		this.#createFighterWeaponArray();

		// Pushes Installed Weapon to the top of the array
		this.#currentFighterArray = pushTargetWeaponObjectOnTop(
			this.#userShipBuild.installedWeapons,
			this.#weaponSlot,
			this.#currentFighterArray
		);

		this.#renderAndListeners();
	};

	#createFighterWeaponArray = () =>
		(this.#currentFighterArray = this.#state.dataState.allFighters.toSorted(
			(a, b) => b.opCost - a.opCost
		));

	// User Clicks to Add Weapon to Installed Weapon Array
	#addCurrentFighterToInstalledWeapons = (btn) => {
		const { weaponPopUpId } = btn.dataset;

		new UpdateUserShipBuild(this.getState()).updateWeapons(
			weaponPopUpId,
			this.#weaponSlot.id
		);

		this.#updateData();
		this.#toggleWeaponAndClosePopUp();
		this.#updateOtherComponents();
	};

	#toggleWeaponAndClosePopUp() {
		// Update WeaponSlots // Render // Listener // Arcs / Background
		new FighterSlots(this.#state).update();
		// Remove WeaponPopUpContainer
		FighterPopUpContainerView._clearRender();
	}

	#fighterPopUpTableSorter = (btn) => {
		const { category } = btn.dataset;
		if (SKIP_SORT_CATEGORY[category]) return;
		// Sort the Table

		const sorterArray = TablePopUpSorter.update([
			category,
			TABLE_POPUP_TYPE,
			this.#currentFighterArray,
			this.#userShipBuild,
		]);

		this.#currentFighterArray = pushTargetWeaponObjectOnTop(
			this.#userShipBuild.installedWeapons,
			this.#weaponSlot,
			sorterArray
		);

		// Render Changes
		this.#tableRenderAndSpinner();
		this.#addEventListeners();
	};
	// Hover
	#showAdditionalInformationOnHover = (btn) => {
		const { weaponPopUpId } = btn.dataset;
		if (this.#currentlyHoveredFighter === weaponPopUpId) return; // guard from mouseover event
		this.#currentlyHoveredFighter = weaponPopUpId;

		const hoveredWeaponObject = weaponSlotIdIntoWeaponSlotObject(
			this.#currentFighterArray,
			weaponPopUpId
		);

		FighterPopUpHoverView.render([
			hoveredWeaponObject,
			this.#weaponSlot,
			this.#getDataState,
		]);
	};

	/////
	// Combined function
	async #renderAndListeners() {
		FighterPopUpContainerView.render(this.#state);
		FighterPopUpTableHeaderView.render(this.#state);

		await this.#tableRenderAndSpinner();
		this.#addEventListeners();
	}

	// Only table and spinner
	async #tableRenderAndSpinner() {
		return await toggleAsyncSpinner(
			() =>
				FighterPopUpTableView.renderAsync([
					this.#installedWeapons,
					this.#currentFighterArray,
					this.#weaponSlot,
				]),
			FighterPopUpContainerView
		);
	}
	// WeaponPopUp Event Listeners
	#addEventListeners() {
		// Listeners
		this.#tableHeaderEventListener();
		this.#tableEventListener();
		this.#closePopUpContainer();
	}
	#tableHeaderEventListener() {
		FighterPopUpTableHeaderView.addClickHandler(
			EVENT_LISTENER_TARGET.TABLE_HEADER_ENTRY,
			EVENT_LISTENER_TYPE.CLICK,
			this.#fighterPopUpTableSorter
		);
	}
	#tableEventListener() {
		FighterPopUpTableView.addClickHandler(
			EVENT_LISTENER_TARGET.TABLE_ENTRIES,
			EVENT_LISTENER_TYPE.CLICK,
			this.#addCurrentFighterToInstalledWeapons
		);
		FighterPopUpTableView.addClickHandler(
			EVENT_LISTENER_TARGET.TABLE_ENTRIES,
			EVENT_LISTENER_TYPE.HOVER,
			this.#showAdditionalInformationOnHover
		);
	}
	#closePopUpContainer() {
		FighterPopUpContainerView.closePopUpContainerIfUserClickOutside(
			`.${CLASS_NAMES.tableContainer}`,
			FighterPopUpContainerView._clearRender
		);
	}
}
