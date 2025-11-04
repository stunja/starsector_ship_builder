import App from "../app.js";
import ViewModel from "../ViewModel.js";
// View
import SearchView from "../allViews/SearchView.js";
import SearchWarningPopUpView from "../allViews/Search/SearchWarningPopUpView.js";

// helper
import CLASS_NAMES from "../helper/ui/class_names.js";
import { GENERIC_STRING } from "../helper/ui/ui_main.js";

const EVENT_LISTENER_TARGET = {
	BUTTON: `.${CLASS_NAMES.searchFormButton}`,
};
const EVENT_LISTENER_TYPE = {
	CLICK: "click",
};
export default class Search extends ViewModel {
	#searchForm;
	#searchField;

	constructor(model) {
		super(model);
	}
	update() {
		// Render
		// SearchView.render(this.getState);
		SearchView.render();

		// Find DOM elements
		const searchFormElement = this.#targetDOM();

		// Capture the input
		SearchView.inputSubmitHandler(searchFormElement, this.#userInput);
	}

	#targetDOM() {
		const parentTarget = document.querySelector(`.${CLASS_NAMES.searchForm}`);
		return parentTarget;
	}

	async #userInput(userInput) {
		const doesUserAllowWipe = true;

		SearchWarningPopUpView.render();
		if (!userInput || userInput === GENERIC_STRING.EMPTY || !doesUserAllowWipe)
			return;
		// clear the workspace and provide new ship as a foundation
		//! I need a form of protection against accidental wiping of old ship
		// new App(userInput);
	}

	// Add later
	#clearInput() {
		this.#searchField.value = GENERIC_STRING.EMPTY;
	}
}
