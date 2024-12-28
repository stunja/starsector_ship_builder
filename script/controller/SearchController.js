import SearchView from "../components/SearchView.js";
import builderView from "../allViews/builderView.js";

class SearchController {
	init() {
		this.#searchRender();
	}

	#searchRender() {
		builderView.renderComponent(SearchView.render());
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
}
export default new SearchController();
