// View
import SearchView from "../allViews/SearchView.js";
import ViewModel from "../ViewModel.js";

// helper
import classNames from "../helper/DomClassNames.js";
import { GENERIC_STRING } from "../helper/MagicStrings.js";

const EVENT_LISTENER_TARGET = {
	BUTTON: `.${classNames.searchFormButton}`,
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
		this.#searchForm = document.querySelector(`.${classNames.searchForm}`);
		this.#searchField = this.#searchForm.querySelector(
			`.${classNames.searchFormInput}`
		);
		this.#searchButton = this.#searchForm.querySelector(
			`${classNames.searchFormButton}`
		);
	}

	#userInput(test) {
		console.log("userInput");
		console.log(test); // input from the search form
	}
	// Add later
	#clearInput() {
		this.#searchField.value = GENERIC_STRING.EMPTY;
	}
}
