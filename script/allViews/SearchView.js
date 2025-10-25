// View
import View from "./view";
// Helper
import DATASET from "../helper/ui/datasets";
import CLASS_NAMES from "../helper/ui/class_names";

import UI_STRINGS from "../helper/ui/ui_strings";
import { GENERIC_STRING } from "../helper/ui/ui_main";

//! missing in different folder
// formInputNames,
// uiDescription,

const STRINGS = {
	LOGO: "Ship Builder",
	SAVED: "Saved Builds",
	SEARCH: "Search",
};
const EVENT_LISTENER_TARGET = {
	SEARCH: "search",
	SAVE: "save",
};

class SearchView extends View {
	_localParent = `.${CLASS_NAMES.nav}`;

	generateMarkup() {
		const markup = `   
            <a href="${GENERIC_STRING.HASH}" class="${CLASS_NAMES.navLogo}">${STRINGS.LOGO}</a>

            <form class="${CLASS_NAMES.searchForm}">
                <input
                    type="text"
                    name="${UI_STRINGS.NAV.SEARCH.INPUT.NAME}"
                    class="${CLASS_NAMES.searchFormInput}"
                    label="${UI_STRINGS.NAV.SEARCH.INPUT.LABEL}"
                    placeholder="${UI_STRINGS.NAV.SEARCH.INPUT.DESC}"
                    value="astral"
                    required
                />

                <button type="submit" class="${CLASS_NAMES.button} ${CLASS_NAMES.searchFormButton}" 
                    ${DATASET.dataNavButtonType}=${EVENT_LISTENER_TARGET.SEARCH}>
                    ${STRINGS.SEARCH}
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
