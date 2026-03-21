import View from "../view";
//
import CLASS_NAMES from "../../helper/ui/class_names";
import UI_DATASETS from "../../helper/ui/ui_datasets";
import { SEARCH_WARNING_POPUP_STRING } from "../../helper/ui/ui_strings";
import FONT_ICONS_MARKUP from "../../helper/ui/font_icons_markup";
//
class SearchWarningPopUpView extends View {
	_localParent = `.${CLASS_NAMES.POP_UP._BASE}`;

	generateMarkup() {
		const currentShip = this._data;
		const customHeader = `<span class="${CLASS_NAMES.TEXT_DECOR.UNDERLINE}">${currentShip.name}</span>`;
		const markup = `
					<div class="${CLASS_NAMES.POP_UP.WARNING_WRAPPER}">
						<div class="${CLASS_NAMES.POP_UP.OVERLAY}">
							<div class="${CLASS_NAMES.POP_UP.WARNING}">
								<h3>${SEARCH_WARNING_POPUP_STRING.HEADER(customHeader)}</h3>
								<p>${SEARCH_WARNING_POPUP_STRING.TEXT}</p>
								<div class="${CLASS_NAMES.POP_UP.WARNING_BAR}">
									${FONT_ICONS_MARKUP.WARNING}
									<p>${SEARCH_WARNING_POPUP_STRING.WARNING_TEXT}</p>
								</div>
								<div class="${CLASS_NAMES.POP_UP.WARNING_WRAPPER_BUTTONS}">
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
								</div>
							</div>
						</div>
					</div>`;
		return markup;
	}
}
export default new SearchWarningPopUpView();
