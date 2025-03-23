// View Model
import ViewModel from "../../ViewModel";
import HullModController from "./HullModController";
import ShipStats from "../ShipStats/ShipStats";

// View
import HullModsPopUpView from "../../allViews/HullMods/HullModsPopUpView";
import HullModsPopUpHeaderView from "../../allViews/HullMods/HullModsPopUpHeaderView";
import HullModsPopUpTableView from "../../allViews/HullMods/HullModsPopUpTableView";
import HullModsPopUpFilterView from "../../allViews/HullMods/HullModsPopUpFilterView";
// Helper Function
import classNames from "../../helper/DomClassNames";
import TablePopUpSorter from "../TablePopUpSorter";
import { GENERIC_STRING, EVENT_LISTENER_TYPE } from "../../helper/MagicStrings";
import HullModHelper from "./HullModHelper";
import HullModFilter from "./HullModFilter";

import {
	SHIELD_TYPE,
	WEAPON_SLOT_TYPE,
	HULL_SIZE,
	SHIP_TYPE,
} from "../../helper/Properties";

const EVENT_LISTENER_TARGET = {
	TABLE_ENTRIES: `.${classNames.tableEntryAvailable}`,
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
	installed: "installed",
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

	#allUnavailableHullMods;
	#currentUnavailableHullMods;

	// UI
	#sortByInstalledCategory = true;

	constructor(model) {
		super(model);

		this.#processData();
		this.#createFilterCategories();
		this.#update();
		this.#render();
	}
	#processData() {
		this.#userShipBuild = this.getUserShipBuild();
		this.#userState = this.getUserState();

		this.#usableHullMods = this.#filterUsableHullModArray();

		this.#shipHullMods = this.#userShipBuild.hullMods;

		this.#builtInMods = this.#userShipBuild.hullMods.builtInMods;
		this.#shieldType = this.#userShipBuild.shieldType;
		this.#shipIsCivilian = this.#userShipBuild.shipIsCivilian;
	}

	#update() {
		// Not a correct implementation, but it works
		this.#processData();

		this.updateUserShipBuildWithHullModLogic();

		this.#createHullModsArray();
	}
	#render() {
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
			this.#currentUnavailableHullMods,
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
		this.#createGreenHullMods();

		this.#updateGreenAndRedHullMods();

		this.#createRedHullMods();
	}
	#filterUsableHullModArray = () =>
		this.#userState.usableHullMods.filter(
			(hullMod) =>
				// HIDDEN ARE TRUE => HIDE
				hullMod.hidden !== GENERIC_STRING.TRUE &&
				// special hide rule
				hullMod.id !== HULLMODS_TO_HIDE[hullMod.id]
		);
	#createGreenHullMods = () => {
		this.#greenHullMods = this.#usableHullMods;
	};

	#createRedHullMods = () => {
		this.#redHullMods = this.#usableHullMods.filter((hullMod) =>
			this.#allUnavailableHullMods.find(
				(unAvailableHullMod) => unAvailableHullMod[0].id === hullMod.id
			)
		);
	};

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

		if (SKIP_SORT_CATEGORY[category]) return this.#installedSpecialSorter();

		this.#regularSorter(category);
	};

	#regularSorter(category) {
		this.#greenHullMods = TablePopUpSorter.update([
			category,
			POPUP_TABLE_TYPE.HULLMOD,
			this.#greenHullMods,
			this.#userShipBuild,
		]);

		this.#sortByInstalledCategory = true;

		// Split Array into Usable and unUsable HullMods
		this.#updateGreenAndRedHullMods();
		// Render
		this.#render();
	}

	// Special sorter for installed category
	#installedSpecialSorter() {
		// if installedHullMods empty ignore
		if (this.#userShipBuild.hullMods.installedHullMods.length < 1) return;

		this.#sortByInstalledCategory = !this.#sortByInstalledCategory;

		// one way sort of InstalledArray
		if (this.#sortByInstalledCategory) {
			this.#greenHullMods = this.#greenHullMods.toSorted((hullModA, hullModB) =>
				hullModA.name.localeCompare(hullModB.name)
			);

			// Render
			this.#render();
			return;
		}

		const installedHullMods = this.#shipHullMods.installedHullMods;

		const putAtTheTop = this.#greenHullMods.filter((hullMod) =>
			installedHullMods.find(
				(installedHullMod) => installedHullMod.id === hullMod.id
			)
		);
		const shorterArray = this.#greenHullMods.filter((hullMod) =>
			installedHullMods.find(
				(installedHullMod) => installedHullMod.id !== hullMod.id
			)
		);

		this.#greenHullMods = [...putAtTheTop, ...shorterArray];
		console.log(this.#greenHullMods);
		// Split Array into Usable and unUsable HullMods
		this.#render();
	}
	//! Remove this
	#test(id) {
		const currentHullMod = this.#usableHullMods.find(
			(hullMod) => hullMod.id === id
		);
		console.log(currentHullMod.id);
		console.log(currentHullMod.name);
	}
	// Add // Remove HullMod
	#toggleHullMod = (btn) => {
		if (!btn?.dataset?.hullmodId) {
			console.error("No hullmodId provided");
			return;
		}

		const { hullmodId } = btn.dataset;
		const userShipBuild = this.getUserShipBuild();
		//! remove this
		this.#test(hullmodId);

		const updatedHullMods = HullModHelper.updateInstalledHullMod(
			hullmodId,
			userShipBuild,
			this.#usableHullMods
		);

		this.setUpdateUserShipBuild({
			...this.#userShipBuild,
			hullMods: updatedHullMods,
		});

		// Update UserShipBuild With new values
		this.updateUserShipBuildWithHullModLogic();
		// fetch update userShipBuild
		this.#userShipBuild = this.getUserShipBuild();

		this.#update();

		// Render & EventListeners
		this.#render();

		// keep the order
		// Update shipStats to render new fields
		new ShipStats(this.getState()).update();
		// Update Controller, to display installedHullMods
		new HullModController(this.getState()).update();
		//
		console.log(this.getUserShipBuild());
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

			if (hullmodId && installedHullMods.some(({ id }) => id === hullmodId)) {
				element.classList.add(CLASSES.WEAPON_POP_UP_ACTIVE);
			}
		});
	}

	// Filter Categories (Buttons to which user can select Filter Options)
	#createFilterCategories() {
		const newArray = this.#usableHullMods.flatMap((hullMod) =>
			hullMod.uiTags.split(GENERIC_STRING.COMMA).map((str) => str.trim())
		);
		newArray.unshift(MISSING_CATEGORY);
		const arrayWithoutDublicates = [...new Set(newArray)];
		// Sort so array always alphabetical it is always the same
		this.#filterCategories = arrayWithoutDublicates
			.filter((string) => string !== GENERIC_STRING.EMPTY)
			.toSorted((a, b) => a.localeCompare(b));
	}

	#filterTable = (btn) => {
		if (!btn?.dataset) {
			throw new Error("Invalid button element provided");
		}

		const { filter: filterUiTag } = btn.dataset;
		this.#sortByInstalledCategory = true;

		// Creates newHullModArray, which is equal to ALL hullmods
		this.#createHullModsArray();
		// If not ALL do the filter, otherwise SKIP
		if (filterUiTag !== MISSING_CATEGORY) {
			this.#greenHullMods = updateArray(this.#greenHullMods);
			this.#redHullMods = updateArray(this.#redHullMods);
		}

		this.#currentUnavailableHullModsWithReason();

		// Assign btn.DataSet to currentFilter => to pass then into render Filter
		this.#currentFilter = filterUiTag;
		this.#update();
		this.#render();

		function updateArray(arr) {
			return arr.filter((hullMod) => {
				if (!hullMod?.uiTags) return false;

				const uiTagArray = hullMod.uiTags
					.split(GENERIC_STRING.COMMA)
					.map((str) => str.trim());
				return uiTagArray.includes(filterUiTag);
			});
		}
	};
	// Green (available) Red (Unavailable)
	#updateGreenAndRedHullMods() {
		// check if hullMod already Build In
		this.#allUnavailableHullMods = HullModFilter.controller(
			this.#usableHullMods,
			this.#userShipBuild
		);

		this.#currentUnavailableHullMods = this.#allUnavailableHullMods;

		// Order Matters First Create Red and then use it in green
		// remove redHullMods from GreenHullMods
		this.#createRedHullMods();

		this.#greenHullMods = HullModFilter.filterDuplicateHullMods(
			this.#greenHullMods,
			this.#redHullMods
		);
	}

	#currentUnavailableHullModsWithReason = () => {
		this.#currentUnavailableHullMods = this.#redHullMods.map((hullMod) =>
			this.#allUnavailableHullMods.find(
				(unHullMod) => unHullMod[0].id === hullMod.id
			)
		);
	};
}
