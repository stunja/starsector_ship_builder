// import App from "../app.js";
import ViewModel from "../ViewModel.js";
// View
import NavigationView from "../allViews/NavigationView.js";
import SearchWarningPopUpView from "../allViews/Search/SearchWarningPopUpView.js";

// helper
import CLASS_NAMES from "../helper/ui/class_names.js";
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
			`.${CLASS_NAMES.searchFormButton}`,
			"click",
			this.#saveBuild
		);
		// Capture the input
		NavigationView.inputSubmitHandler(
			document.querySelector(`.${CLASS_NAMES.searchForm}`),
			this.#userInput
		);
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
	#saveBuild(btn) {
		console.log(btn);
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
