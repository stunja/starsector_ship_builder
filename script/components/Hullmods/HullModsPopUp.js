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
	constructor(data) {
		super(data);

		this.#allHullMods = data;
	}
	update() {
		this.#renderHullModsPopUp();

		this.#eventListeners();
	}
	#renderHullModsPopUp() {
		HullModsPopUpView.render(this.#allHullMods);
		HullModsPopUpHeaderView.render(this.#allHullMods);
		HullModsPopUpTableView.render(this.#allHullMods);
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
