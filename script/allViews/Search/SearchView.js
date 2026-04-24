// View
import NewView from "../NewView";
// Helper
import CLASS_NAMES from "../../helper/ui/class_names";
import { NAV_STRING } from "../../helper/ui/ui_strings";
import FONT_ICONS_MARKUP from "../../helper/ui/font_icons_markup";

// UI
export default class SearchView extends NewView {
	static LOCAL_PARENT = CLASS_NAMES.SEARCH._BASE;

	#inputElement;
	//
	// constructor({ model = {}, callback = {} } = {}) {
	// 	super(model);

	// 	this.#searchClick = callback.click;
	// 	this.#searchInput = callback.input;
	// }

	_generateMarkup() {
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

	// _setupEventListeners() {
	// 	this._onClick(CLASS_NAMES.SEARCH.INPUT, this._callbacks.click);
	// }
	//! dont rememenber what this line does
	// this.#inputElement = this._getElement(CLASS_NAMES.SEARCH.INPUT);
	// this._inputCapture(CLASS_NAMES.SEARCH.INPUT, this.#searchInput);

	clearInputField() {
		this.#inputElement.value = "";
		this.#inputElement.blur();
	}
}
