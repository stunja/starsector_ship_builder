import classNames from "../helper/DomClassNames";
import View from "./view";
import DataSet from "../helper/DataSet";

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
	_localParent = `.${classNames.nav}`;

	generateMarkup() {
		const markup = `   
            <a href="#" class="${classNames.navLogo}">${STRINGS.LOGO}</a>

            <form class="${classNames.searchForm}">
                <input
                    name="search"
                    type="text"
                    class="${classNames.searchFormInput}"
                    placeholder="Enter the name of the ship"
                    value="test"
                    required
                />

                <button type="submit" class="${classNames.button} ${classNames.searchFormButton}" 
                    ${DataSet.dataNavButtonType}=${EVENT_LISTENER_TARGET.SEARCH}>
                    ${STRINGS.SEARCH}
                </button>
            </form>

            <button class="${classNames.button} ${classNames.searchFormButton}" 
                    ${DataSet.dataNavButtonType}=${EVENT_LISTENER_TARGET.SAVE}>
                    ${STRINGS.SAVED}
                </button>
        `;

		return markup;
	}
}
export default new SearchView();
