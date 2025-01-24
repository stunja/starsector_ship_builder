// View Model
import ViewModel from "../../ViewModel";
// View
import HullModsPopUpView from "../../allViews/HullMods/HullModsPopUpView";
import HullModsPopUpHeaderView from "../../allViews/HullMods/HullModsPopUpHeaderView";
import HullModsPopUpTableView from "../../allViews/HullMods/HullModsPopUpTableView";
// Helper Function
import classNames from "../../helper/DomClassNames";

const EVENT_LISTENER_TARGET = {
	TABLE_ENTRIES: `.${classNames.tableEntries}`,
	TABLE_HEADER_ENTRY: `.${classNames.tableHeaderEntry}`,
};
const EVENT_LISTENER_TYPE = {
	CLICK: "click",
	HOVER: "mouseover",
};
const CLASSES = {
	TABLE_CONTAINER: `.${classNames.tableContainer}`,
};
export default class HullModsPopUp extends ViewModel {
	#allHullMods;
	#usableHullMods;
	#userShipBuild;
	constructor(data) {
		super(data);

		const [userShipBuild, allHullMods] = data;
		this.#allHullMods = allHullMods;
		this.#userShipBuild = userShipBuild;
	}
	update() {
		this.#filterHullMods();

		this.#renderHullModsPopUp();

		this.#eventListeners();
	}
	#renderHullModsPopUp() {
		HullModsPopUpView.render(this.#usableHullMods);
		HullModsPopUpHeaderView.render(this.#usableHullMods);
		HullModsPopUpTableView.render([this.#usableHullMods, this.#userShipBuild]);
	}
	#eventListeners() {
		this.#addWeaponPopUpTableHeaderListener();
		this.#addWeaponPopUpEntryListener();

		// Close if clicked outside
		HullModsPopUpView.closePopUpContainerIfUserClickOutside(
			CLASSES.TABLE_CONTAINER,
			HullModsPopUpView._clearRender
		);
	}
	#filterHullMods() {
		this.#usableHullMods = this.#allHullMods.filter(
			(hullMod) => hullMod.hidden !== "TRUE"
		);
	}
	// WeaponPopUp Event Listeners
	#addWeaponPopUpTableHeaderListener() {
		HullModsPopUpHeaderView.addClickHandler(
			EVENT_LISTENER_TARGET.TABLE_HEADER_ENTRY,
			EVENT_LISTENER_TYPE.CLICK,
			this.#popUpSorter
		);
	}
	#addWeaponPopUpEntryListener() {
		HullModsPopUpTableView.addClickHandler(
			EVENT_LISTENER_TARGET.TABLE_ENTRIES,
			EVENT_LISTENER_TYPE.CLICK,
			this.#test
		);
		// HullModsPopUpTableView.addClickHandler(
		// 	EVENT_LISTENER_TARGET.TABLE_ENTRIES,
		// 	EVENT_LISTENER_TYPE.HOVER,
		// 	this.#showAdditionalInformationOnHover
		// );
	}
	#popUpSorter = (btn) => {
		console.log(btn);
		// Sort the Table
		// this.#currentWeaponArray = TablePopUpSorter.update([
		// 	btn,
		// 	TABLE_POPUP_TYPE,
		// 	this.#currentWeaponArray,
		// ]);
		// Render Changes
		// this.#renderWeaponPopUpAndAddEventListeners();
	};

	#test(btn) {
		console.log(btn);
	}
}
