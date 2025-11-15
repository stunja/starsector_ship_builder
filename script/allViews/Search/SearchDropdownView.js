import CLASS_NAMES from "../../helper/ui/class_names";
// View
import View from "../view";
const STRINGS = {};

class SearchDropdownView extends View {
	_localParent = `.${CLASS_NAMES.SEARCH.DROPDOWN}`;

	generateMarkup() {
		const listOfShipObjectsToDisplay = this._data;

		const markup = `
        <div class="${CLASS_NAMES.SEARCH.INPUT}">
            ${this.#dropdownItems(listOfShipObjectsToDisplay)}
        </div>`;
		return markup;
	}
	#dropdownItems(data) {
		const namesOnly = data.map((ship) => ship.name);
		console.log(data);
		const markup = `
            <div class="dropdown-item">
                ${namesOnly}
            </div>
        `;
		return markup;
	}
}
export default new SearchDropdownView();
