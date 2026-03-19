// View
import View from "./view";
// Helper

// UI
import { GENERIC_STRING } from "../helper/ui/ui_main";
import CLASS_NAMES from "../helper/ui/class_names";
import UI_DATASETS from "../helper/ui/ui_datasets";
import FONT_ICONS from "../helper/ui/font_icons_markup";
import { NAV_STRING } from "../helper/ui/ui_strings";

class NavigationView extends View {
	_localParent = `.${CLASS_NAMES.NAVIGATION._BASE}`;

	generateMarkup() {
		const markup = `   
            <a href="${GENERIC_STRING.HASH}" class="${CLASS_NAMES.NAVIGATION.NAV_LOGO}">
                ${NAV_STRING.LOGO}
            </a>

            <div class="${CLASS_NAMES.SEARCH._BASE}">
                <div class="${CLASS_NAMES.SEARCH.WRAPPER}">
					<div>
						${FONT_ICONS.SEARCH}
					</div>
                    <input
                        type="text"
                        class="${CLASS_NAMES.SEARCH.INPUT}"
                        placeholder="${NAV_STRING.SEARCH_INPUT_PLACEHOLDER}"
                        autocomplete="off"
                    />
                    <div class="${CLASS_NAMES.SEARCH.DROPDOWN._BASE} ${CLASS_NAMES.ANIM.HIDDEN}"></div>
                </div>
			    <div class="${CLASS_NAMES.SEARCH.SELECTED}"></div>
		    </div>

            <button class="${CLASS_NAMES.button} ${CLASS_NAMES.NAVIGATION.SAVE_BUILD}" ${UI_DATASETS.NAV.FORM.SAVE}>
                    ${NAV_STRING.SAVE_BUILDS_BUTTON}
            </button>
        `;

		return markup;
	}
}
export default new NavigationView();
