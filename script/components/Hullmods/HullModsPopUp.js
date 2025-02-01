// View Model
import ViewModel from "../../ViewModel";
// View
import HullModsPopUpView from "../../allViews/HullMods/HullModsPopUpView";
import HullModsPopUpHeaderView from "../../allViews/HullMods/HullModsPopUpHeaderView";
import HullModsPopUpTableView from "../../allViews/HullMods/HullModsPopUpTableView";
// Helper Function
import classNames from "../../helper/DomClassNames";
import TablePopUpSorter from "../TablePopUpSorter";
import HullModsPopUpFilterView from "../../allViews/HullMods/HullModsPopUpFilterView";

const EVENT_LISTENER_TARGET = {
	TABLE_ENTRIES: `.${classNames.tableEntries}`,
	TABLE_HEADER_ENTRY: `.${classNames.tableHeaderEntry}`,
	FILTER_BUTTON: `.${classNames.filterButton}`,
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
const MISSING_CATEGORY = "All";

export default class HullModsPopUp extends ViewModel {
	#userShipBuild;

	#usableHullMods;
	#allHullMods;
	#userState;
	#shipHullMods;

	#hullSize;
	#currentFilter = MISSING_CATEGORY;
	#filterCategories;

	constructor(model) {
		super(model);

		this.#processData();
		this.#createHullModsArray();
		this.#createFilterCategories();
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
		// Container
		HullModsPopUpView.render(this.#allHullMods);
		// Header
		HullModsPopUpFilterView.render([
			this.#filterCategories,
			this.#currentFilter,
		]);
		HullModsPopUpHeaderView.render(this.#allHullMods);
		// Table
		HullModsPopUpTableView.render([this.#allHullMods, this.#userShipBuild]);
	}
	#eventListeners() {
		this.#addWeaponPopUpTableHeaderListener();
		this.#addWeaponPopUpEntryListener();
		this.#addFilterListener();

		// Close if clicked outside
		HullModsPopUpView.closePopUpContainerIfUserClickOutside(
			CLASSES.TABLE_CONTAINER,
			HullModsPopUpView._clearRender
		);
	}
	#createHullModsArray() {
		this.#allHullMods = this.#usableHullMods.filter(
			(hullMod) => hullMod.hidden !== STRING.TRUE
		);
	}

	// WeaponPopUp Event Listeners
	#addFilterListener() {
		HullModsPopUpFilterView.addClickHandler(
			EVENT_LISTENER_TARGET.FILTER_BUTTON,
			EVENT_LISTENER_TYPE.CLICK,
			this.#filterTable
		);
	}

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

		this.#allHullMods = TablePopUpSorter.update([
			btn,
			"hullModPopUpTable",
			this.#allHullMods,
			this.#userShipBuild,
		]);
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

	#createFilterCategories() {
		const newArray = this.#allHullMods.flatMap((hullMod) =>
			hullMod.uiTags.split(",").map((str) => str.trim())
		);
		newArray.unshift(MISSING_CATEGORY);
		const arrayWithoutDublicates = [...new Set(newArray)];

		// Sort so array always alphabetical it is always the same
		this.#filterCategories = arrayWithoutDublicates.toSorted((a, b) =>
			a.localeCompare(b)
		);
	}

	#filterTable = (btn) => {
		if (!btn?.dataset) {
			throw new Error("Invalid button element provided");
		}
		const { filter: filterUiTag } = btn.dataset;
		// Creates newHullModArray, which is equal to ALL hullmods
		this.#createHullModsArray();

		// If not ALL do the filter, otherwise SKIP
		if (filterUiTag !== MISSING_CATEGORY) {
			this.#allHullMods = this.#allHullMods.filter((hullMod) => {
				if (!hullMod?.uiTags) return false;

				const uiTagArray = hullMod.uiTags.split(",").map((str) => str.trim());
				return uiTagArray.includes(filterUiTag);
			});
		}
		// Assign btn.DataSet to currentFilter => to pass then into render Filter
		this.#currentFilter = filterUiTag;
		this.#update();
	};
}
