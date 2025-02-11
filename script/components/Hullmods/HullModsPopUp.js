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
import { GENERIC_STRING, EVENT_LISTENER_TYPE } from "../../helper/MagicStrings";
import HullModController from "./HullModController";
import { removeInstalledHullMod, hullModLogic } from "./HullModHelper";

const EVENT_LISTENER_TARGET = {
	TABLE_ENTRIES: `.${classNames.tableEntries}`,
	TABLE_HEADER_ENTRY: `.${classNames.tableHeaderEntry}`,
	FILTER_BUTTON: `.${classNames.filterButton}`,
};
const CLASSES = {
	TABLE_CONTAINER: `.${classNames.tableContainer}`,
	WEAPON_POP_UP_ACTIVE: classNames.weaponPopUpActive,
};

const POPUP_TABLE_TYPE = {
	HULLMOD: "hullModPopUpTable",
};

const SKIP_SORT_CATEGORY = {
	icon: "icon",
	description: "description",
};
const HULLMODS_TO_HIDE = {
	// these hullMods where remove from the game, for some reason.

	pdintegration: "pdintegration", // #Point Defense Integration
	assault_package: "assault_package", // Assault Package
	missile_autoloader: "missile_autoloader", // Missile Autoloader
};
const MISSING_CATEGORY = "All";

export default class HullModsPopUp extends ViewModel {
	#userShipBuild;

	// #greenHullMods;
	#userState;
	#shipHullMods;

	#hullSize;
	#currentFilter = MISSING_CATEGORY;
	#filterCategories;

	//ShipProps
	#usableHullMods;
	#builtInMods;
	#shieldType;
	#shipIsCivilian;

	#greenHullMods = [];
	#redHullMods = [];

	constructor(model) {
		super(model);

		this.#processData();
		this.#createHullModsArray();
		this.#splitHullModArrayIntoGreenAndRed();
		this.#createFilterCategories();
		this.#update();
	}
	#processData() {
		this.#userShipBuild = this.getUserShipBuild();
		this.#userState = this.getUserState();

		this.#usableHullMods = this.#userState.usableHullMods;
		this.#shipHullMods = this.#userShipBuild.hullMods;

		this.#builtInMods = this.#userShipBuild.hullMods.builtInMods;
		this.#shieldType = this.#userShipBuild.shieldType;
		this.#shipIsCivilian = this.#userShipBuild.shipIsCivilian;
	}
	#update() {
		this.#renderHullModsPopUp();

		this.#eventListeners();

		this.#assignActiveClasses();
	}
	#renderHullModsPopUp() {
		// Container
		HullModsPopUpView.render(this.#greenHullMods);
		// Header
		HullModsPopUpFilterView.render([
			this.#filterCategories,
			this.#currentFilter,
		]);
		HullModsPopUpHeaderView.render(this.#greenHullMods);
		// Table
		HullModsPopUpTableView.render([
			this.#greenHullMods,
			this.#redHullMods,
			this.#userShipBuild,
		]);
	}
	#eventListeners() {
		this.#addWeaponPopUpTableHeaderListener();
		this.#addWeaponPopUpEntryListener();
		this.#addFilterListener();
		this.#closePopUp();
	}
	#createHullModsArray() {
		const removeHiddenHullMods = this.#usableHullMods.filter(
			(hullMod) => hullMod.hidden !== GENERIC_STRING.TRUE
		);

		// this.#greenHullMods =
		// 	this.#hideSpecificHullMods(removeHiddenHullMods);
		this.#greenHullMods = this.#hideSpecificHullMods(removeHiddenHullMods);
	}
	#hideSpecificHullMods = (arr) =>
		arr.filter((hullMod) => hullMod.id !== HULLMODS_TO_HIDE[hullMod.id]);

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
	#closePopUp() {
		// Close if clicked outside
		HullModsPopUpView.closePopUpContainerIfUserClickOutside(
			CLASSES.TABLE_CONTAINER,
			HullModsPopUpView._clearRender
		);
	}
	// TablePopUpSorter
	#popUpSorter = (btn) => {
		const { category } = btn.dataset;
		if (SKIP_SORT_CATEGORY[category]) return;

		this.#greenHullMods = TablePopUpSorter.update([
			btn,
			POPUP_TABLE_TYPE.HULLMOD,
			this.#greenHullMods,
			this.#userShipBuild,
		]);
		this.#update();
	};
	#giveNameOfCurrentHullMod(hullmodId) {
		//hullmodId
		const findTheHullModObject = this.#greenHullMods.find(
			(hullMod) => hullMod.id === hullmodId
		);
		console.log(findTheHullModObject.name && findTheHullModObject.id);
	}
	// Add // Remove HullMod
	#toggleHullMod = (btn) => {
		if (!btn?.dataset?.hullmodId) {
			console.error("No hullmodId provided");
			return;
		}

		const { hullmodId } = btn.dataset;
		const { hullMods } = this.getUserShipBuild();
		this.#giveNameOfCurrentHullMod(hullmodId);
		const updatedHullMods = removeInstalledHullMod(hullmodId, hullMods);

		this.setUpdateUserShipBuild({
			...this.#userShipBuild,
			hullMods: updatedHullMods,
		});

		// For some reason EventListeners can be replaced.
		// So I reimplement them back.
		this.#eventListeners();
		this.#assignActiveClasses();

		// Update Controller, to display installedHullMods
		new HullModController(this.getState()).update();
	};

	// Turn HullMod Entry to Active => different Color
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

	// Filter Categories (Buttons to which user can select Filter Options)
	#createFilterCategories() {
		const newArray = this.#greenHullMods.flatMap((hullMod) =>
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
			this.#greenHullMods = this.#greenHullMods.filter((hullMod) => {
				if (!hullMod?.uiTags) return false;

				const uiTagArray = hullMod.uiTags.split(",").map((str) => str.trim());
				return uiTagArray.includes(filterUiTag);
			});
		}
		// Assign btn.DataSet to currentFilter => to pass then into render Filter
		this.#currentFilter = filterUiTag;
		this.#update();
	};
	// HullMods unavailable Logic
	#splitHullModArrayIntoGreenAndRed() {
		// console.log(this.#greenHullMods);
		console.log(this.#userShipBuild);
		// check if hullMod already Build In
		// const builtInMods = this.#userShipBuild.hullMods.builtInMods;
		// const shieldType = this.#userShipBuild.shieldType;
		// const allHullMods = this.#userState.usableHullMods;

		const arrayWithoutBuildInHullMods = hullModLogic.filterBuildInHullMods(
			this.#usableHullMods,
			this.#builtInMods
		);
		// isCiv
		// shipIsCivilian
		console.log(this.#shipIsCivilian);

		const shieldTypeFilter = hullModLogic.filterByShieldType(
			this.#usableHullMods,
			this.#shieldType
		);
		// check if ship has Hangars
		// console.log(arrayWithoutBuildInHullMods);
		this.#redHullMods = [...arrayWithoutBuildInHullMods, shieldTypeFilter];
		this.#greenHullMods = hullModLogic.filterDuplicateHullMods(
			this.#greenHullMods,
			this.#redHullMods
		);
	}
}
