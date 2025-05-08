// View Model
import ViewModel from "../../ViewModel";
import HullModController from "./HullModController";
import ShipStats from "../ShipStats/ShipStats";
import FighterSlots from "../Fighter/FighterSlots";
// View
import HullModsPopUpView from "../../allViews/HullMods/HullModsPopUpView";
import HullModsPopUpHeaderView from "../../allViews/HullMods/HullModsPopUpHeaderView";
import HullModsPopUpTableView from "../../allViews/HullMods/HullModsPopUpTableView";
import HullModsPopUpFilterView from "../../allViews/HullMods/HullModsPopUpFilterView";
//
import HullModHelper from "./HullModHelper";
import HullModFilter from "./HullModFilter";
// Helper Function
import classNames from "../../helper/DomClassNames";
import TablePopUpSorter from "../TablePopUpSorter";
import { GENERIC_STRING, EVENT_LISTENER_TYPE } from "../../helper/MagicStrings";
import { updateUserShipBuildWithHullModLogic } from "../../helper/helperFunction";
import UpdateUserShipBuild from "../../helper/UpdateUserShipBuild";

import { SHIELD_TYPE, HULL_SIZE, SHIP_TYPE } from "../../helper/Properties";

import { ScrollPosition } from "../../helper/ScrollPosition";

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
	#_baseUserShipBuild;
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

		new ScrollPosition().clear(classNames.tableContainer);

		this.#updateData();
		this.#createFilterCategories();
		this.#update();
		this.#render();
	}
	#updateData() {
		this.#userShipBuild = this.getUserShipBuild();
		this.#_baseUserShipBuild = this._getBaseShipBuild();
		this.#userState = this.getUserState();

		this.#usableHullMods = this.#filterUsableHullModArray();
		this.#shipHullMods = this.#userShipBuild.hullMods;

		this.#builtInMods = this.#userShipBuild.hullMods.builtInMods;
		this.#shieldType = this.#userShipBuild.shieldType;
		this.#shipIsCivilian = this.#userShipBuild.shipIsCivilian;
	}
	#updateOtherComponents() {
		// Scroll to position user previously was, to prevent annoying jumps
		new ScrollPosition().load(classNames.tableContainer);

		// keep the order
		// Update shipStats to render new fields
		new ShipStats(this.getState()).update();

		// Update Controller, to display installedHullMods
		new HullModController(this.getState()).update();

		// Update Fighter Slots (in case change in amount fighter Bays)
		new FighterSlots(this.getState()).update();
	}
	#update() {
		// Not a correct implementation, but it works
		this.#updateData();

		this.#createHullModsArray();
	}
	#render() {
		this.#renderHullModsPopUp();

		this.#eventListeners();

		this.#assignActiveClasses();

		new ScrollPosition().save(classNames.tableContainer);
	}

	#renderHullModsPopUp() {
		// Container
		HullModsPopUpView.render(this.#greenHullMods);

		// Filter
		HullModsPopUpFilterView.render([
			this.#filterCategories,
			this.#currentFilter,
		]);
		// Header
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
	// Removes HullMods with [hidden] and [special] rules
	#filterUsableHullModArray = () => {
		return this.#userState.usableHullMods.filter(
			(hullMod) =>
				// HIDDEN ARE TRUE => HIDE
				hullMod.hidden !== GENERIC_STRING.TRUE &&
				// special hide rule
				hullMod.id !== HULLMODS_TO_HIDE[hullMod.id]
		);
	};

	// Available HullMods [Green]
	#createGreenHullMods = () => {
		this.#greenHullMods = this.#usableHullMods;
	};
	// Unavailable HullMods [Red]
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
	// Close if clicked outside
	#closePopUp() {
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
			this.#greenHullMods.sort((hullModA, hullModB) =>
				hullModA.name.localeCompare(hullModB.name)
			);
			// Render
			this.#render();
			return;
		}

		// Split Array into Usable and unUsable HullMods
		const installedHullMods = this.#shipHullMods.installedHullMods;

		this.#greenHullMods.sort((a, b) => {
			const topDownSort = installedHullMods.some(({ id }) => id === a.id);
			const downTopSort = installedHullMods.some(({ id }) => id === b.id);

			// sorting logic (zero means no change)
			return topDownSort ? -1 : downTopSort ? 1 : 0;
		});
		// Render
		this.#render();
	}

	// Add // Remove HullMod
	#toggleHullMod = (btn) => {
		if (!btn?.dataset?.hullmodId) {
			console.error("No hullmodId provided");
			return;
		}

		const { hullmodId } = btn.dataset;

		new UpdateUserShipBuild(this.getState()).updateHullMods(
			hullmodId,
			this.#usableHullMods
		);

		// OverWrite Sort
		this.#sortByInstalledCategory = true;

		// Update all values including [red] and [green] array
		// has dublication with [updateUserShipBuildWithHullModLogic] but without, it overwrites with old parameneters
		this.#update();

		// only show case currentFilter which is not [all]
		if (this.#currentFilter !== MISSING_CATEGORY) {
			this.#filterHullModArrayBySelectedHullModCategory(this.#currentFilter);
		}

		// Update reason for [red] array
		this.#currentUnavailableHullModsWithReason();

		// Render & EventListeners
		this.#render();
		this.#updateOtherComponents();
	};

	// Turn HullMod Entry to Active => different Color
	#assignActiveClasses() {
		this.#updateData();

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

	// Create new [green] array with selected UiTags (HullMod Type)
	#filterTable = (btn) => {
		if (!btn?.dataset) {
			throw new Error("Invalid button element provided");
		}

		const { filter: filterUiTag } = btn.dataset;
		this.#sortByInstalledCategory = true;

		this.#update();
		// If not ALL do the filter, otherwise SKIP
		if (filterUiTag !== MISSING_CATEGORY) {
			this.#filterHullModArrayBySelectedHullModCategory(filterUiTag);
		}

		this.#currentUnavailableHullModsWithReason();

		// Assign btn.DataSet to currentFilter => to pass then into render Filter
		this.#currentFilter = filterUiTag;
		//
		this.#render();
	};
	#filterHullModArrayBySelectedHullModCategory(filterUiTag) {
		this.#greenHullMods = filterArray(this.#greenHullMods);
		this.#redHullMods = filterArray(this.#redHullMods);

		function filterArray(arr) {
			return arr.filter((hullMod) => {
				if (!hullMod?.uiTags) return false;

				const uiTagArray = hullMod.uiTags
					.split(GENERIC_STRING.COMMA)
					.map((str) => str.trim());
				return uiTagArray.includes(filterUiTag);
			});
		}
	}
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
