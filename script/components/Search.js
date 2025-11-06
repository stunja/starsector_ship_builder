// import App from "../app.js";
import ViewModel from "../ViewModel.js";
// View
import SearchView from "../allViews/SearchView.js";
import SearchWarningPopUpView from "../allViews/Search/SearchWarningPopUpView.js";

// helper
import CLASS_NAMES from "../helper/ui/class_names.js";
import { GENERIC_STRING, EVENT_LISTENER_TYPE } from "../helper/ui/ui_main.js";

export default class Search extends ViewModel {
	#searchForm;
	#searchField;
	#getState;
	constructor(model) {
		super(model);

		this.#getState = this.getState();
	}
	update() {
		// Render
		SearchView.render(this.getState());
		// Find DOM elements
		const searchFormElement = this.#targetDOM();

		// Capture the input
		SearchView.inputSubmitHandler(searchFormElement, this.#userInput);
	}

	#targetDOM() {
		const parentTarget = document.querySelector(`.${CLASS_NAMES.searchForm}`);
		return parentTarget;
	}

	#userInput = (userInput) => {
		const doesUserAllowWipe = true;

		this.#isUserInputValid();
		SearchWarningPopUpView.render(this.#getState);
		this.#buttonEventHandlers();
		if (!userInput || userInput === GENERIC_STRING.EMPTY || !doesUserAllowWipe)
			return;
		// clear the workspace and provide new ship as a foundation
		//! I need a form of protection against accidental wiping of old ship
		// new App(userInput);
	};
	#buttonEventHandlers() {
		SearchWarningPopUpView.addClickHandler(
			`.${CLASS_NAMES.popUpWarningButton}`,
			EVENT_LISTENER_TYPE.CLICK,
			this.#test
		);
	}
	#test(btn) {
		console.log(btn);
		const test = btn.dataset.wipeWarning;
		console.log(test);
	}
	#isUserInputValid() {
		console.log(true);
		console.log(false);
	}
	// Add later
	#clearInput() {
		this.#searchField.value = GENERIC_STRING.EMPTY;
	}
}
