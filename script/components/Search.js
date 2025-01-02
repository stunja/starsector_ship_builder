import SearchView from "../allViews/SearchView.js";
import ViewModel from "../ViewModel.js";

export default class Search extends ViewModel {
	constructor(model) {
		super(model);
	}
	update() {
		this.#searchRender();
	}

	#searchRender() {
		SearchView.render(this.getState);
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
