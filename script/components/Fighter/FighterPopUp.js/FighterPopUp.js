import ViewModel from "../../../ViewModel";
import TablePopUpSorter from "../../TablePopUpSorter";
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

export default class FighterPopUp extends ViewModel {
	#state;
	#userShipBuild;
	#getDataState;
	#weaponSlot;
	// Fighter Object which can be shown to user
	#currentFighterArray;
	#currentlyHoveredFighter;

	constructor(model) {
		super(model);

		this.#state = this.getState();
		this.#getDataState = this.getDataState();

		this.#currentFighterArray = this.#sortFighterArray(
			this.#state.dataState.allFighters
		);

		this.#userShipBuild = this.#state.userState.userShipBuild;
	}
	#sortFighterArray = (arr) => arr.toSorted((a, b) => b.opCost - a.opCost);

	update = (btn) => {
		if (!btn) return;

		this.#weaponSlot = weaponSlotIdIntoWeaponSlotObject(
			this.#userShipBuild.weaponSlots,
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
			this.#userShipBuild.installedWeapons,
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
			this.#testClick
		);
		FighterPopUpTableView.addClickHandler(
			EVENT_LISTENER_TARGET.TABLE_ENTRIES,
			EVENT_LISTENER_TYPE.HOVER,
			this.#showAdditionalInformationOnHover
		);
	}
	#testClick(btn) {
		console.log("Click", btn);
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
	#addEventListeners() {
		// Listeners
		this.#tableHeaderEventListener();
		this.#tableEventListener();

		FighterPopUpContainerView.closePopUpContainerIfUserClickOutside(
			`.${classNames.tableContainer}`,
			FighterPopUpContainerView._clearRender
		);
	}
}
