import ViewModel from "../../../ViewModel";
import TablePopUpSorter from "../../TablePopUpSorter";
import FighterSlots from "../FighterSlots";
// View
import FighterPopUpContainerView from "../../../allViews/Fighters/FighterPopUpContainerView";
import FighterPopUpTableHeaderView from "../../../allViews/Fighters/FighterPopUpTableHeaderView";
import FighterPopUpTableView from "../../../allViews/Fighters/FighterPopUpTableView";
import FighterPopUpHoverView from "../../../allViews/Fighters/FighterPopUpHoverView";
// Helper
import { weaponSlotIdIntoWeaponSlotObject } from "../../../helper/helperFunction";
import classNames from "../../../helper/DomClassNames";

const EVENT_LISTENER_TARGET = {
	TABLE_ENTRIES: `.${classNames.tableEntries}`,
	TABLE_HEADER_ENTRY: `.${classNames.tableHeaderEntry}`,
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
	#fighterPopUpOpen = false;
	constructor(model) {
		super(model);
	}
	#processData() {
		this.#state = this.getState();
		this.#getDataState = this.#state.dataState;

		this.#currentFighterArray = this.#sortFighterArray(
			this.#state.dataState.allFighters
		);

		this.#userShipBuild = this.getUserShipBuild();
		this.#installedWeapons = this.#userShipBuild.installedWeapons;
		this.#weaponsSlots = this.#userShipBuild.weaponSlots;
	}
	#sortFighterArray = (arr) => arr.toSorted((a, b) => b.opCost - a.opCost);

	update = (btn) => {
		if (!btn) return;

		this.#processData();

		this.#weaponSlot = weaponSlotIdIntoWeaponSlotObject(
			this.#weaponsSlots,
			btn.dataset.fighterId
		);

		this.#renderFighterPopUp();
		this.#addEventListeners();
	};
	// render
	#renderFighterPopUp() {
		FighterPopUpContainerView.render(this.#state);
		FighterPopUpTableHeaderView.render(this.#state);

		FighterPopUpTableView.render([
			this.#installedWeapons,
			this.#currentFighterArray,
			this.#weaponSlot,
		]);
	}
	// WeaponPopUp Event Listeners
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
	#addEventListeners() {
		// Listeners
		this.#tableHeaderEventListener();
		this.#tableEventListener();

		FighterPopUpContainerView.closePopUpContainerIfUserClickOutside(
			`.${classNames.tableContainer}`,
			FighterPopUpContainerView._clearRender
		);
	}
	// User Clicks to Add Weapon to Installed Weapon Array
	#addCurrentFighterToInstalledWeapons = (btn) => {
		const { weaponPopUpId } = btn.dataset;
		//
		const updatedInstalledWeapons = this.#installedWeapons.map(
			([slotId, currentWeapon]) => {
				// If weapon already exists in slot, remove it
				if (currentWeapon === weaponPopUpId) {
					this.#fighterPopUpOpen = true;
					return [slotId, ""];
				}
				// if weapon dont match, keep the original
				if (slotId !== this.#weaponSlot.id) {
					return [slotId, currentWeapon];
				}
				// Otherwise, add the new weapon
				return [slotId, weaponPopUpId];
			}
		);

		// update weapons
		this.setUpdateUserShipBuild({
			...this.#userShipBuild,
			installedWeapons: updatedInstalledWeapons,
		});
		// assign new installedWeapons
		this.#installedWeapons = this.getUserShipBuild().installedWeapons;

		this.#fighterPopUpOpen === true
			? this.#addWeaponAndCloseWeaponPopUp()
			: this.#removeActiveWeaponAndReRenderWeaponPopUp();
	};
	#removeActiveWeaponAndReRenderWeaponPopUp() {
		// Update WeaponSlots // Render // Listener // Arcs / Background
		new FighterSlots(this.#state).update();

		// Remove WeaponPopUpContainer
		FighterPopUpContainerView._clearRender();

		// Render Again
		this.#renderFighterPopUp();
		this.#addEventListeners();
	}
	#addWeaponAndCloseWeaponPopUp() {
		// Update WeaponSlots // Render // Listener // Arcs / Background
		new FighterSlots(this.#state).update();

		// Remove WeaponPopUpContainer
		FighterPopUpContainerView._clearRender();
	}
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
	#fighterPopUpTableSorter = (btn) => {
		const { category } = btn.dataset;
		if (SKIP_SORT_CATEGORY[category]) return;
		// Sort the Table
		this.#currentFighterArray = TablePopUpSorter.update([
			btn,
			TABLE_POPUP_TYPE,
			this.#currentFighterArray,
		]);
		// Render Changes
		this.#renderFighterPopUp();
		this.#addEventListeners();
	};
}
