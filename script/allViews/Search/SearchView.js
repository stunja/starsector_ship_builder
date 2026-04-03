// View
import View from "../view";
// Helper
import CLASS_NAMES from "../../helper/ui/class_names";
import { NAV_STRING } from "../../helper/ui/ui_strings";
import FONT_ICONS_MARKUP from "../../helper/ui/font_icons_markup";

// UI
class SearchView extends View {
	_localParent = `.${CLASS_NAMES.SEARCH._BASE}`;

	generateMarkup() {
		const markup = `   
            <div class="${CLASS_NAMES.SEARCH.WRAPPER}">
					${FONT_ICONS_MARKUP.SEARCH}
                    <input
                        type="text"
                        class="${CLASS_NAMES.SEARCH.INPUT}"
                        placeholder="${NAV_STRING.SEARCH_INPUT_PLACEHOLDER}"
                        autocomplete="off"
                    />
                    <div class="${CLASS_NAMES.SEARCH.DROPDOWN._BASE}"></div>
                </div>
			    <div class="${CLASS_NAMES.SEARCH.SELECTED}">
            </div>
        `;

		return markup;
	}
	#searchInputSelector() {
		const localParentElement = document.querySelector(this._localParent);
		const searchInputElement = localParentElement.querySelector(
			`.${CLASS_NAMES.SEARCH.INPUT}`,
		);

		return searchInputElement;
	}
	inputCapture(returnFunc) {
		// const dropdownElement = localParentElement.querySelector(
		// 	`.${CLASS_NAMES.SEARCH.DROPDOWN._BASE}`,
		// );

		this.#searchInputSelector().addEventListener("input", (e) => {
			const query = e.target.value.trim().toLowerCase();
			// dropdownElement.classList.remove(CLASS_NAMES.ANIM.FADE_OUT);

			// IF empty input, hide dropdown
			// if (!query) {
			// 	searchInputElement.value = "";
			// 	dropdownElement.classList.add(CLASS_NAMES.ANIM.FADE_OUT);
			// 	return;
			// }
			returnFunc(query);
		});
		// 	const matchedItems = this.#filterShipsByQuery(query);
		// 	this.#renderSearchResults(matchedItems);
		// });
	}
	clearInputField() {
		this.#searchInputSelector().value = "";
	}
}
export default new SearchView();
