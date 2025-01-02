import classNames from "../helper/DomClassNames";
import View from "./view";

const STRINGS = {
	LOGO: "Ship Builder",
	SAVED: "Saved Builds",
	SEARCH: "Search",
};
class SearchView extends View {
	_localParent = `.${classNames.nav}`;

	generateMarkup() {
		const markup = `   
            <a href="#" class="${classNames.navLogo}">${STRINGS.LOGO}</a>

            <form class="${classNames.searchForm}">
                <input
                    type="text"
                    id="search-nav-top"
                    placeholder="Enter the name of the ship"
                    value="astral"
                    required
                />

                <button type="submit" class="${classNames.button} ${classNames.searchForm__Button}">${STRINGS.SEARCH}</button>
            </form>

            <button class="${classNames.button}">${STRINGS.SAVED}</button>
        `;

		return markup;
	}
}
export default new SearchView();
