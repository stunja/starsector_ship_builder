import App from "../app.js";
import ViewModel from "../ViewModel.js";
// View
import NavigationView from "../allViews/NavigationView.js";
import SearchWarningPopUpView from "../allViews/Search/SearchWarningPopUpView.js";
import SearchDropdownView from "../allViews/Search/SearchDropdownView.js";

// helper
import CLASS_NAMES from "../helper/ui/class_names.js";
import UI_DATASETS from "../helper/ui/ui_datasets.js";
import { GENERIC_STRING, EVENT_LISTENER_TYPE } from "../helper/ui/ui_main.js";

//! SEARCH INPUT NEEDS TO BE MORE COMPLEX
//! make transition
//! THERE IS NO WAY TO SEARCH FOR SKINS (FOR EXAMPLE ONSLAUGH XIV). I dont see a way to connect them systemically
export default class Navigation extends ViewModel {
	#searchForm;
	#searchField;
	#getState;
	#currentUserInput;
	constructor(model) {
		super(model);

		this.#getState = this.getState();
	}
	update() {
		// Render
		NavigationView.render(this.getState());

		// EventHandler
		NavigationView.addClickHandler(
			`.${CLASS_NAMES.NAVIGATION.SAVE_BUILD}`,
			"click",
			this.#saveBuild
		);

		// dynamic search field
		this.#dynamicInputListener();
	}

	// Set up dynamic search input listener
	#dynamicInputListener() {
		const localParentElement = document.querySelector(
			`.${CLASS_NAMES.SEARCH._BASE}`
		);
		const searchInputElement = localParentElement.querySelector(
			`.${CLASS_NAMES.SEARCH.INPUT}`
		);

		const dropdownElement = localParentElement.querySelector(
			`.${CLASS_NAMES.SEARCH.DROPDOWN._BASE}`
		);

		searchInputElement.addEventListener("input", (e) => {
			const query = e.target.value.trim().toLowerCase();

			dropdownElement.classList.remove(CLASS_NAMES.ANIM.HIDDEN);

			// IF empty input, hide dropdown
			if (!query) {
				searchInputElement.value = "";
				dropdownElement.classList.add(CLASS_NAMES.ANIM.HIDDEN);
				return;
			}

			const matchedItems = this.#filterShipsByQuery(query);
			this.#renderSearchResults(matchedItems);
		});
	}

	#filterShipsByQuery(query) {
		const allShip = this.#getState.dataState.allShipHulls;

		const FILTER_CATEGORIES = [
			"name",
			"techManufacturer",
			"designation",
			"hints",
		];

		const sortByName = FILTER_CATEGORIES.flatMap((category) => {
			return allShip.filter((item) => {
				return item[category].toLowerCase().includes(query);
			});
		});
		const newTest = sortByName.toSorted((a, b) => {
			return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
		});

		return newTest;
	}

	#renderSearchResults(matchedItems) {
		SearchDropdownView.render(matchedItems);
		SearchDropdownView.addClickHandler(
			`.${CLASS_NAMES.SEARCH.DROPDOWN.ITEM}`,
			"click",
			this.#handleShipSelection
		);
	}
	#handleShipSelection = (btn) => {
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

	#warningPopUp = () => {
		SearchWarningPopUpView.render(this.#currentUserInput);

		SearchWarningPopUpView.addClickHandler(
			`.${CLASS_NAMES.POP_UP.WARNING_BUTTON}`,
			"click",
			this.#searchWarningLogic
		);

		SearchWarningPopUpView.closePopUpContainerIfUserClickOutside(
			`.${CLASS_NAMES.POP_UP.WARNING}`,
			this.#closePopUpAndClearInput
		);
	};
	#closePopUpAndClearInput() {
		SearchWarningPopUpView._clearRender();
		SearchDropdownView._clearRender();

		// clear input input field
		NavigationView._clearTargetValue(`.${CLASS_NAMES.SEARCH.INPUT}`);
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
