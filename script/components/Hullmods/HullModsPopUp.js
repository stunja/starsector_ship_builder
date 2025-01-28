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
	WEAPON_POP_UP_ACTIVE: "weaponPopUpActive",
};
const STRING = {
	EMPTY: "",
	SPACE: " ",
};
export default class HullModsPopUp extends ViewModel {
	#userShipBuild;

	#allHullMods;
	#usableHullMods;
	#userState;
	#shipHullMods;

	constructor(model) {
		super(model);

		this.#update();
	}
	#processData() {
		this.#userShipBuild = this.getUserShipBuild();
		this.#userState = this.getUserState();

		this.#allHullMods = this.#userState.usableHullMods;
		this.#shipHullMods = this.#userShipBuild.hullMods;
	}
	#update() {
		this.#processData();

		this.#filterHullMods();

		this.#renderHullModsPopUp();

		this.#eventListeners();

		this.#assignActiveClasses();
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
			this.#toggleHullMod
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

	#toggleHullMod = (buttonElement) => {
		if (!buttonElement?.dataset?.hullmodId) {
			console.error("No hullmodId provided");
			return;
		}

		const { hullmodId } = buttonElement.dataset;
		const { hullMods } = this.getUserShipBuild();
		const { installedHullMods } = hullMods;

		const isHullModInstalled = installedHullMods.includes(hullmodId);

		// if hullMod is installed create new array, without it
		const updatedInstalledHullMods = isHullModInstalled
			? installedHullMods.filter((mod) => mod !== hullmodId)
			: [...installedHullMods, hullmodId];

		const updatedHullMods = {
			...hullMods,
			installedHullMods: updatedInstalledHullMods,
		};

		this.setUpdateUserShipBuild({
			...this.#userShipBuild,
			hullMods: updatedHullMods,
		});

		// For some reason EventListeners can replaced.
		// So I reimplement them back.
		this.#eventListeners();
		this.#assignActiveClasses();
	};
	#assignActiveClasses() {
		this.#processData();

		const hullMods = this.#shipHullMods;
		const installedHullMods = hullMods.installedHullMods;
		if (!installedHullMods) return;

		const allTableEntries = document.querySelectorAll(
			EVENT_LISTENER_TARGET.TABLE_ENTRIES
		);

		// remove active class from all elements
		allTableEntries.forEach((entry) =>
			entry.classList.remove(classNames.weaponPopUpActive)
		);
		// add active class to elements equal to installedHullMods
		allTableEntries.forEach((element) => {
			const { hullmodId } = element.dataset;
			if (hullmodId && installedHullMods.includes(hullmodId)) {
				element.classList.add(classNames.weaponPopUpActive);
			}
		});
	}
}
