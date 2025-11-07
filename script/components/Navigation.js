// import App from "../app.js";
import ViewModel from "../ViewModel.js";
// View
import NavigationView from "../allViews/NavigationView.js";
import SearchWarningPopUpView from "../allViews/Search/SearchWarningPopUpView.js";

// helper
import CLASS_NAMES from "../helper/ui/class_names.js";
import UI_DATASETS from "../helper/ui/ui_datasets.js";
import { GENERIC_STRING, EVENT_LISTENER_TYPE } from "../helper/ui/ui_main.js";

export default class Navigation extends ViewModel {
	#searchForm;
	#searchField;
	#getState;
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
		// Capture the input
		NavigationView.inputSubmitHandler(
			document.querySelector(`.${CLASS_NAMES.SEARCH_FORM._BASE}`),
			this.#userSearchInputLogic
		);
	}

	#userSearchInputLogic = (userInput) => {
		// check if ship even exists
		if (
			!userInput ||
			userInput === GENERIC_STRING.EMPTY ||
			!this.#isUserInputValid(userInput)
		) {
			console.log("ship doesnt exists");
			return;
		}

		// clear the workspace and provide new ship as a foundation
		// Display warning to protect user from loosing current design
		//! I need a form of protection against accidental wiping of old ship
		this.#warningPopUpRender();
		this.#warningPopUpHandler();

		// new App(userInput);
	};
	#warningPopUpRender() {
		SearchWarningPopUpView.render(this.#getState);
	}
	#warningPopUpHandler() {
		SearchWarningPopUpView.addClickHandler(
			`.${CLASS_NAMES.popUpWarningButton}`,
			"click",
			this.#searchWarningLogic
		);
	}

	// user selected correct ship from a dropdown, and they see a warning pop up.
	#searchWarningLogic(btn) {
		const userAction = btn.dataset.wipeWarning;
		if (userAction === UI_DATASETS.ONLY_ID.RETURN) {
			SearchWarningPopUpView._clearRender();
			// clear input input field
			NavigationView._clearTargetValue(
				`.${CLASS_NAMES.SEARCH_FORM.FORM_INPUT}`
			);
		}
		// search-form__input
		if (userAction === UI_DATASETS.ONLY_ID.CONTINUE) console.log("continue");
	}
	// Check if ship user searches even exist
	#isUserInputValid(shipId) {
		const allShips = this.#getState.dataState.allShips;
		const isUserSearchesWithCorrectShipId = allShips.find(
			(ship) => ship.id === shipId
		);

		if (isUserSearchesWithCorrectShipId) return true;
	}

	// TODO
	// A way for a user to save their current design
	#saveBuild(btn) {
		console.log(`Save current Ship functionality`);
		console.log(btn);
	}
}
