// import View from "../view";
import NewView from "../NewView";
//
import CLASS_NAMES from "../../helper/ui/class_names";
import UI_DATASETS from "../../helper/ui/ui_datasets";
import { SEARCH_WARNING_POPUP_STRING } from "../../helper/ui/ui_strings";
import FONT_ICONS_MARKUP from "../../helper/ui/font_icons_markup";
//
export default class SearchWarningPopUpView extends NewView {
	static LOCAL_PARENT = CLASS_NAMES.POP_UP._BASE;

	_generateMarkup() {
		const currentShip = this._inputs.currentUserInput;
		const currentShipName = currentShip.name;

		const markup = `
					<div class="${CLASS_NAMES.POP_UP.WARNING_WRAPPER}">
						<div class="${CLASS_NAMES.POP_UP.OVERLAY}">
							<div class="${CLASS_NAMES.POP_UP.WARNING}">
								${this.#customHeader(currentShipName)}
								<p>${SEARCH_WARNING_POPUP_STRING.TEXT}</p>
								${this.#warningBar()}
								${this.#buttons()}
							</div>
						</div>
					</div>`;
		return markup;
	}
	#customHeader(currentShipName) {
		return `<h3>
					${SEARCH_WARNING_POPUP_STRING.HEADER(
						`<span class="${CLASS_NAMES.TEXT_DECOR.UNDERLINE}">${currentShipName}</span>`,
					)}
				</h3>`;
	}
	#warningBar() {
		return `<div class="${CLASS_NAMES.POP_UP.WARNING_BAR}">
						${FONT_ICONS_MARKUP.WARNING}
						<p>${SEARCH_WARNING_POPUP_STRING.WARNING_TEXT}</p>
				</div>`;
	}

	#buttons() {
		return `<div class="${CLASS_NAMES.POP_UP.WARNING_WRAPPER_BUTTONS}">
					<button class="${CLASS_NAMES.button} 
					${CLASS_NAMES.BUTTON.SECONDARY} ${CLASS_NAMES.POP_UP.WARNING_BUTTON}"
					${UI_DATASETS.MAIN_POPUP.WIPE_WARNING.RETURN}
					>
						${SEARCH_WARNING_POPUP_STRING.BUTTONS.RETURN}
					</button>

					<button class="${CLASS_NAMES.button} ${CLASS_NAMES.POP_UP.WARNING_BUTTON}" 
					${UI_DATASETS.MAIN_POPUP.WIPE_WARNING.CONTINUE}>
						${SEARCH_WARNING_POPUP_STRING.BUTTONS.CONTINUE}
					</button>

				</div>`;
	}

	_setupEventListeners() {
		this._onClick(CLASS_NAMES.POP_UP.WARNING_BUTTON, this._callbacks.click);
		this._onClose(CLASS_NAMES.POP_UP.WARNING, this._callbacks.close);

		// this.mouseClick(
		// 	CLASS_NAMES.POP_UP.WARNING_BUTTON,
		// 	this.#searchWarningLogic,
		// );
		// this.closePopUpContainerIfUserClickOutside(
		// 	CLASS_NAMES.POP_UP.WARNING,
		// 	this.#closePopUpAndClearInput,
		// );
	}
}
