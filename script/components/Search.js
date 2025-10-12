// View
import SearchView from "../allViews/SearchView.js";
import ViewModel from "../ViewModel.js";

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
	#searchButton;

	constructor(model) {
		super(model);
	}
	update() {
		// Render
		SearchView.render(this.getState);

		// Find DOM elements
		this.#searchObjects();

		// Capture the input
		SearchView.inputSubmitHandler(this.#searchForm, this.#userInput);
	}

	#searchObjects() {
		this.#searchForm = document.querySelector(`.${CLASS_NAMES.searchForm}`);
		this.#searchField = this.#searchForm.querySelector(
			`.${CLASS_NAMES.searchFormInput}`
		);
		this.#searchButton = this.#searchForm.querySelector(
			`${CLASS_NAMES.searchFormButton}`
		);
	}

	#userInput(test) {
		console.log(test); // input from the search form
	}
	// Add later
	#clearInput() {
		this.#searchField.value = GENERIC_STRING.EMPTY;
	}
}
