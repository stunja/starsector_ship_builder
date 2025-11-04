// View
import View from "./view";
// Helper
import DATASET from "../helper/ui/datasets";
import CLASS_NAMES from "../helper/ui/class_names";

import UI_STRINGS from "../helper/ui/ui_strings";
import { GENERIC_STRING } from "../helper/ui/ui_main";

//
const STRINGS = {
	SAVED: "Saved Builds",
};
const EVENT_LISTENER_TARGET = {
	SEARCH: "search",
	SAVE: "save",
};

class SearchView extends View {
	_localParent = `.${CLASS_NAMES.nav}`;

	generateMarkup() {
		const markup = `   
            <a href="${GENERIC_STRING.HASH}" class="${CLASS_NAMES.navLogo}">${UI_STRINGS.NAV.LOGO.TEXT}</a>

            <form class="${CLASS_NAMES.searchForm}">
                <input
                    type="search"
                    name="${UI_STRINGS.NAV.SEARCH.INPUT.NAME}"
                    class="${CLASS_NAMES.searchFormInput}"
                    label="${UI_STRINGS.NAV.SEARCH.INPUT.LABEL}"
                    placeholder="${UI_STRINGS.NAV.SEARCH.INPUT.DESC}"
                    value=""
                    required
                />

                <button type="submit" class="${CLASS_NAMES.button} ${CLASS_NAMES.searchFormButton}" 
                    ${DATASET.dataNavButtonType}=${EVENT_LISTENER_TARGET.SEARCH}>
                    ${UI_STRINGS.NAV.SEARCH.BUTTON.TEXT}
                </button>
            </form>

            <button class="${CLASS_NAMES.button} ${CLASS_NAMES.searchFormButton}" 
                    ${DATASET.dataNavButtonType}=${EVENT_LISTENER_TARGET.SAVE}>
                    ${STRINGS.SAVED}
            </button>
        `;

		return markup;
	}
}
export default new SearchView();
