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
		this.#dynamicUserInputCapture();
	}
	#dynamicUserInputCapture() {
		const localParent = document.querySelector(`.${CLASS_NAMES.SEARCH._BASE}`);
		const searchInput = localParent.querySelector(
			`.${CLASS_NAMES.SEARCH.INPUT}`
		);

		NavigationView._inputDynamicListener(
			searchInput,
			this.#getState.dataState.allShipHulls,
			this.#displayMatchedItems
		);
	}
	#displayMatchedItems = (value) => {
		SearchDropdownView.render(value);

		SearchDropdownView.addClickHandler(
			`.${CLASS_NAMES.SEARCH.DROPDOWN.ITEM}`,
			"click",
			this.#switchToDifferentShip
		);
	};
	#switchToDifferentShip = (btn) => {
		const shipId = btn.getAttribute(UI_DATASETS.NAV.DROPDOWN._BASE);

		// Check if ship user searches even exist
		const isUserSearchesWithCorrectShipId =
			this.#getState.dataState.allHulls.find((ship) => ship.id === shipId);

		if (!isUserSearchesWithCorrectShipId) {
			console.log("ship doesnt exists");
			return;
		}
		this.#currentUserInput = isUserSearchesWithCorrectShipId;

		// Display warning to protect user from loosing current design
		this.#warningPopUp();
	};

	#warningPopUp = () => {
		SearchWarningPopUpView.render(this.#currentUserInput);

		SearchWarningPopUpView.addClickHandler(
			`.${CLASS_NAMES.POP_UP.WARNING_BUTTON}`,
			"click",
			this.#searchWarningLogic
		);
	};

	// user selected correct ship from a dropdown, and they see a warning pop up.
	#searchWarningLogic = (btn) => {
		const userAction = btn.dataset.wipeWarning;

		if (userAction === UI_DATASETS.ONLY_ID.RETURN) {
			SearchWarningPopUpView._clearRender();

			// clear input input field
			NavigationView._clearTargetValue(`.${CLASS_NAMES.SEARCH.INPUT}`);
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
