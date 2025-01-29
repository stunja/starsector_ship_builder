// View Model
import ViewModel from "../../ViewModel";
// View
import HullModsPopUpView from "../../allViews/HullMods/HullModsPopUpView";
import HullModsPopUpHeaderView from "../../allViews/HullMods/HullModsPopUpHeaderView";
import HullModsPopUpTableView from "../../allViews/HullMods/HullModsPopUpTableView";
// Helper Function
import classNames from "../../helper/DomClassNames";
import TablePopUpSorter from "../TablePopUpSorter";

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
	WEAPON_POP_UP_ACTIVE: classNames.weaponPopUpActive,
};
const STRING = {
	EMPTY: "",
	SPACE: " ",
	TRUE: "TRUE",
};
const SKIP_SORT_CATEGORY = {
	icon: "icon",
	description: "description",
};
export default class HullModsPopUp extends ViewModel {
	#userShipBuild;

	#usableHullMods;
	#filteredHullMods;
	#userState;
	#shipHullMods;

	#hullSize;
	constructor(model) {
		super(model);

		this.#processData();
		this.#filterHullMods();
		this.#update();
	}
	#processData() {
		this.#userShipBuild = this.getUserShipBuild();
		this.#userState = this.getUserState();

		this.#usableHullMods = this.#userState.usableHullMods;
		this.#shipHullMods = this.#userShipBuild.hullMods;
	}
	#update() {
		this.#renderHullModsPopUp();

		this.#eventListeners();

		this.#assignActiveClasses();
	}
	#renderHullModsPopUp() {
		HullModsPopUpView.render(this.#filteredHullMods);
		HullModsPopUpHeaderView.render(this.#filteredHullMods);
		HullModsPopUpTableView.render([
			this.#filteredHullMods,
			this.#userShipBuild,
		]);
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
		this.#filteredHullMods = this.#usableHullMods.filter(
			(hullMod) => hullMod.hidden !== STRING.TRUE
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
	// TablePopUpSorter
	#popUpSorter = (btn) => {
		const { category } = btn.dataset;
		if (SKIP_SORT_CATEGORY[category]) return;

		this.#filteredHullMods = TablePopUpSorter.update([
			btn,
			"hullModPopUpTable",
			this.#filteredHullMods,
			this.#userShipBuild,
		]);
		console.log(btn);
		console.log(this.#filteredHullMods);
		this.#update();
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
			entry.classList.remove(CLASSES.WEAPON_POP_UP_ACTIVE)
		);
		// add active class to elements equal to installedHullMods
		allTableEntries.forEach((element) => {
			const { hullmodId } = element.dataset;
			if (hullmodId && installedHullMods.includes(hullmodId)) {
				element.classList.add(CLASSES.WEAPON_POP_UP_ACTIVE);
			}
		});
	}
}
