// View
import View from "./view";
// Helper
import CLASS_NAMES from "../helper/ui/class_names";
import { GENERIC_STRING } from "../helper/ui/ui_main";
import UI_DATASETS from "../helper/ui/ui_datasets";

//
const STRINGS = {
	INPUT: {
		NAME: "search-input",
		PLACEHOLDER: "Enter the name of the ship...",
		LABEL: "Search input field",
	},
	BUTTONS: {
		SEARCH: "Search",
		SAVE_BUILDS: "Saved Builds",
	},
	LOGO: {
		TEXT: "Ship Builder",
	},
};

class NavigationView extends View {
	_localParent = `.${CLASS_NAMES.NAVIGATION._BASE}`;

	generateMarkup() {
		const markup = `   
            <a href="${GENERIC_STRING.HASH}" class="${CLASS_NAMES.NAVIGATION.NAV_LOGO}">
                ${STRINGS.LOGO.TEXT}
            </a>

            <div class="${CLASS_NAMES.SEARCH._BASE}">
                <div class="${CLASS_NAMES.SEARCH.WRAPPER}">
                    <input
                        type="text"
                        class="${CLASS_NAMES.SEARCH.INPUT}"
                        placeholder="${STRINGS.INPUT.PLACEHOLDER}"
                        autocomplete="off"
                    />
                    <div class="${CLASS_NAMES.SEARCH.DROPDOWN._BASE}"></div>
                </div>
			    <div class="${CLASS_NAMES.SEARCH.SELECTED}"></div>
		    </div>

            <button class="${CLASS_NAMES.button} ${CLASS_NAMES.NAVIGATION.SAVE_BUILD}" ${UI_DATASETS.NAV.FORM.SAVE}>
                    ${STRINGS.BUTTONS.SAVE_BUILDS}
            </button>
        `;

		return markup;
	}
}
export default new NavigationView();
