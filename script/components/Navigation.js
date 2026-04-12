import App from "../app.js";
import ViewModel from "../ViewModel.js";
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

//! make transition
//! THERE IS NO WAY TO SEARCH FOR SKINS (FOR EXAMPLE ONSLAUGH XIV). I dont see a way to connect them systemically

export default class Navigation extends ViewModel {
	#searchForm;
	#searchField;
	#getState;
	#currentUserInput;
	#allShipHulls;

	#FILTER_CATEGORIES = ["name", "techManufacturer", "designation", "hints"];
	// Sub Object, holds additional properties
	#ADDITIONAL_DATA_PROPERTIES = ["hullSize"];

	constructor(model) {
		super(model);

		this.#getState = this.getState();
		this.#allShipHulls = this.#getState.dataState.allShipHulls;
	}
	update() {
		// Render
		NavigationView.render(this.getState());
		// NavigationView.addMouseClickHandler(
		// 	CLASS_NAMES.NAVIGATION.SAVE_BUILD,
		// 	this.#saveBuild,
		// );
		NavigationView.mouseClick(
			CLASS_NAMES.NAVIGATION.SAVE_BUILD,
			this.#saveBuild,
		);

		// Search
		SearchView.render();
		SearchView.addMouseClickHandler(CLASS_NAMES.SEARCH.INPUT, () => {
			console.log("user clicked on the input");
			const allShips = arrayToSortedByName(this.#allShipHulls);
			this.#renderSearchResults(allShips);
		});

		// SearchView.inputCapture(this.#showFilteredDropdownItems);
	}

	#showFilteredDropdownItems = (inputCapture) => {
		const filteredShips = this.#filterShipsByQuery(inputCapture);
		this.#renderSearchResults(filteredShips);
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

	#renderSearchResults(matchedItems) {
		//
		// const dropdownState = SearchDropdownView._localParentElement
		// if (isOpen) {
		// 	this.#closeDropDown();
		// } else {
		// 	this.#openDropDown();
		// }
		// SearchDropdownView.render(matchedItems);
		// SearchDropdownView.addMouseClickHandler(
		// 	CLASS_NAMES.SEARCH.DROPDOWN.ITEM,
		// 	this.#onDropDownItemSelection,
		// );
		// // search_dropdown
		// SearchDropdownView.closePopUpContainerIfUserClickOutside(
		// 	CLASS_NAMES.SEARCH.DROPDOWN._BASE,
		// 	async () => {
		// 		SearchView.clearInputField();
		// 		await SearchDropdownView.fadeOutAnimation();
		// 		SearchDropdownView._clearRender();
		// 	},
		// );
	}
	#openDropDown(btn) {
		this.#onDropDownItemSelection(btn);
	}
	#closeDropDown() {}
	// user selected one of the ships in dropdown menu
	#onDropDownItemSelection = (btn) => {
		const shipId = btn.getAttribute(UI_DATASETS.NAV.DROPDOWN._BASE);
		const selectedShip = this.#findShipById(shipId);

		if (!selectedShip) {
			console.warn(`Ship with ID "${shipId}" not found`);
			return;
		}

		this.#currentUserInput = selectedShip;
		this.#warningPopUp();
	};

	#findShipById(shipId) {
		return this.#getState.dataState.allHulls.find((ship) => ship.id === shipId);
	}

	#warningPopUp() {
		SearchWarningPopUpView.renderAsync(this.#currentUserInput);

		SearchWarningPopUpView.addMouseClickHandler(
			CLASS_NAMES.POP_UP.WARNING_BUTTON,
			this.#searchWarningLogic,
		);

		SearchWarningPopUpView.closePopUpContainerIfUserClickOutside(
			CLASS_NAMES.POP_UP.WARNING,
			this.#closePopUpAndClearInput,
		);
	}

	async #closePopUpAndClearInput() {
		await SearchWarningPopUpView.fadeOutAnimation();
		SearchWarningPopUpView._clearRender();
	}

	// user selected correct ship from a dropdown, and they see a warning pop up.
	#searchWarningLogic = (btn) => {
		const userAction = btn.dataset.wipeWarning;

		if (userAction === UI_DATASETS.ONLY_ID.RETURN) {
			this.#closePopUpAndClearInput();
		}

		// clear the workspace and provide new ship as a foundation
		if (userAction === UI_DATASETS.ONLY_ID.CONTINUE) {
			new App(this.#currentUserInput.id);
		}
	};

	// TODO
	// A way for a user to save their current design
	#saveBuild(btn) {
		console.log(`Save current Ship functionality`);
		console.log(btn);
	}
}
