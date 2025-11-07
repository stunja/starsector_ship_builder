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
		DESC: "Enter the name of the ship...",
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

            <form class="${CLASS_NAMES.searchForm}">
                <input
                    type="search"
                    name="${STRINGS.INPUT.NAME}"
                    class="${CLASS_NAMES.searchFormInput}"
                    label="${STRINGS.INPUT.LABEL}"
                    placeholder="${STRINGS.INPUT.DESC}"
                    value=""
                    required
                />

                <button type="submit" class="${CLASS_NAMES.button} ${CLASS_NAMES.searchFormButton}" ${UI_DATASETS.NAV.FORM.SEARCH}>
                    ${STRINGS.BUTTONS.SEARCH}
                </button>
            </form>

            <button class="${CLASS_NAMES.button} ${CLASS_NAMES.searchFormButton}" ${UI_DATASETS.NAV.FORM.SAVE}>
                    ${STRINGS.BUTTONS.SAVE_BUILDS}
            </button>
        `;

		return markup;
	}
}
export default new NavigationView();
