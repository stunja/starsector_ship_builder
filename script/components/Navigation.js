import App from "../app.js";
import ViewModel from "../ViewModel.js";
import SearchDropdown from "./Navigation/SearchDropdown.js";
// View
import NavigationView from "../allViews/NavigationView.js";
import SearchWarningPopUpView from "../allViews/Search/SearchWarningPopUpView.js";
import SearchDropdownView from "../allViews/Search/SearchDropdownView.js";
import SearchView from "../allViews/Search/SearchView.js";

// helper
import CLASS_NAMES from "../helper/ui/class_names.js";
import UI_DATASETS from "../helper/ui/ui_datasets.js";
import { GENERIC_STRING, EVENT_LISTENER_TYPE } from "../helper/ui/ui_main.js";
import { arrayToSortedByName } from "../helper/helper_functions.js";
import EventManager from "../eventHandlers/EventManager.js";
import { UI_ERRORS } from "../helper/Errors.js";

//! make transition
//! THERE IS NO WAY TO SEARCH FOR SKINS (FOR EXAMPLE ONSLAUGH XIV). I dont see a way to connect them systemically

export default class Navigation extends ViewModel {
	#searchForm;
	#searchField;
	#getState;
	#currentUserInput;
	#allShipHulls;

	#searchInputElement;

	#FILTER_CATEGORIES = ["name", "techManufacturer", "designation", "hints"];
	// Sub Object, holds additional properties
	#ADDITIONAL_DATA_PROPERTIES = ["hullSize"];

	#NavigationView;
	#SearchView;
	#SearchDropdownView;
	#SearchWarningPopUpView;
	//
	constructor(model) {
		super(model);

		//! bad implementation
		this.#getState = this.getState();
		this.#allShipHulls = this.#getState.dataState.allShipHulls;

		this.#NavigationView = new NavigationView(model, this.#handleSave);

		// Search
		// this.#SearchView = new SearchView({
		// 	model: this.#getState,
		// 	callback: {
		// 		click: this.#searchInputClick,
		// 		input: this.#handleSearchInputText,
		// 	},
		// });
	}
	async update() {
		// Render
		this.#NavigationView.render();
		this.#NavigationView.setupEventListeners();

		this.#SearchView = await SearchView.create({
			model: this.#getState,
			callback: {
				click: this.#handleSearchInputClick,
				input: this.#handleSearchInputText,
			},
		});

		// this.#SearchView.inputCapture(this.#handleSearchInputText);
	}

	#handleSearchInputClick = (clickInput) => {
		this.#searchInputElement = clickInput;
		const allShips = arrayToSortedByName(this.#allShipHulls);
		this.#renderDropDownSearch(allShips);
	};
	#handleSearchInputText = (inputCapture) => {
		const filteredShips = this.#filterShipsByQuery(inputCapture);
		this.#renderDropDownSearch(filteredShips);
	};
	// TODO
	// A way for a user to save their current design
	#handleSave = (btn) => {
		console.log(`Save current Ship functionality`);
		console.log(btn);
	};

	#filterShipsByQuery = (query) => {
		const normalziedQuery = query.toLowerCase();

		const matchingValues = (value) => {
			if (Array.isArray(value)) {
				return value.some((v) => v.toLowerCase().includes(normalziedQuery));
			}
			if (typeof value === "string") {
				return value.toLowerCase().includes(normalziedQuery);
			}
			return false;
		};

		const filteredShips = this.#allShipHulls.filter((ship) => {
			const categoryMatch = this.#FILTER_CATEGORIES.some((key) => {
				return matchingValues(ship[key]);
			});
			const hullSizeMatch = this.#ADDITIONAL_DATA_PROPERTIES.some((key) => {
				return matchingValues(ship.additionalData?.[key]);
			});
			return categoryMatch || hullSizeMatch;
		});

		return arrayToSortedByName(filteredShips);

		//! replace
		// return filteredShips.toSorted((a, b) =>
		// 	a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
		// );
	};

	#renderDropDownSearch(matchedItems) {
		this.#SearchDropdownView = new SearchDropdownView(
			this.#onDropDownItemSelection,
			this.#closeSearchDropdown,
		);

		this.#SearchDropdownView.render(matchedItems);
		this.#SearchDropdownView.setupEventListeners();
	}
	async #closeSearchDropdown() {
		this.#SearchView.clearInputField();
		await this.#SearchDropdownView.fadeOutAnimation();
		//! clear  ONCLOSE eventListeners somewhere here
		this.#SearchDropdownView._clearRender();
	}
	//
	// user selected one of the ships in dropdown menu
	#onDropDownItemSelection = (btn) => {
		if (!btn) {
			throw new Error(UI_ERRORS.MISSING.ELEMENT(this.constructor.name, btn));
		}

		const shipId = btn.getAttribute(UI_DATASETS.NAV.DROPDOWN._BASE);
		const selectedShip = this.#findShipById(shipId);

		if (!selectedShip) {
			console.warn(`Ship with ID "${shipId}" not found`);
			return;
		}

		this.#warningPopUp(selectedShip);
	};

	#findShipById(shipId) {
		return this.#getState.dataState.allHulls.find((ship) => ship.id === shipId);
	}

	#warningPopUp(selectedShip) {
		this.#currentUserInput = selectedShip;

		this.#SearchWarningPopUpView = new SearchWarningPopUpView(
			this.#currentUserInput,
			this.#searchWarningLogic,
			this.#closePopUpAndClearInput,
		);

		this.#SearchWarningPopUpView.init();
		this.#SearchWarningPopUpView.setupEventListeners();
	}

	// user selected correct ship from a dropdown, and they see a warning pop up.
	#searchWarningLogic = (btn) => {
		console.log(btn);
		const userAction = btn.dataset.wipeWarning;

		if (userAction === UI_DATASETS.ONLY_ID.RETURN) {
			this.#closePopUpAndClearInput();
		}

		// clear the workspace and provide new ship as a foundation
		if (userAction === UI_DATASETS.ONLY_ID.CONTINUE) {
			new App(this.#currentUserInput.id);
		}
	};

	async #closePopUpAndClearInput() {
		await this.#SearchWarningPopUpView.fadeOutAnimation();
		this.#SearchWarningPopUpView._clearRender();
	}
}
