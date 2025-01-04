import SearchView from "../allViews/SearchView.js";
import ViewModel from "../ViewModel.js";

import classNames from "../helper/DomClassNames.js";

const EVENT_LISTENER_TARGET = {
	BUTTON: `.${classNames.searchForm__Button}`,
};
export default class Search extends ViewModel {
	constructor(model) {
		super(model);
	}
	update() {
		this.#searchRender();
	}

	#searchRender() {
		SearchView.render(this.getState);
		SearchView.addClickHandler(EVENT_LISTENER_TARGET.BUTTON, this.test);
	}
	test(btn) {
		console.log(btn);
	}
}
//! Finish later

// #clearInput() {
// 	this.#parentElement.querySelector(".search-form__input").value = "";
// }
// addSearchHandler(inputFunction) {
// 	this.#parentElement.addEventListener("submit", function (e) {
// 		e.preventDefault();
// 		inputFunction();
// 	});
// }
// getInputValue = () => {
// 	const inputValue = this.#parentElement.querySelector(
// 		".search-form__input"
// 	).value;
// 	// this.#clearInput(); //
// 	return inputValue;
// };

//   addHandlerClick(handler) {
//     this._parentElement.addEventListener('click', function (e) {
//       const btn = e.target.closest('.btn--inline');
//       if (!btn) return;

//       const goToPage = +btn.dataset.goto;
//       handler(goToPage);
//     });

//   }
