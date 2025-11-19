import CLASS_NAMES from "../../helper/ui/class_names";
import UI_DATASETS from "../../helper/ui/ui_datasets";
// View
import View from "../view";
const STRINGS = {};

class SearchDropdownView extends View {
	_localParent = `.${CLASS_NAMES.SEARCH.DROPDOWN._BASE}`;

	generateMarkup() {
		const listOfShipObjectsToDisplay = this._data;

		const markup = this.#dropdownItems(listOfShipObjectsToDisplay);
		return markup;
	}
	#dropdownItems(data) {
		const markup = data
			.map((ship) => {
				const markup = `
								<div class="${CLASS_NAMES.SEARCH.DROPDOWN.ITEM}" 
									${UI_DATASETS.NAV.DROPDOWN.FUNC(ship.id)}
								>
									<p class="${CLASS_NAMES.SEARCH.DROPDOWN.ITEM_NAME}">${ship.name}</p>
									<p class="${CLASS_NAMES.SEARCH.DROPDOWN.ITEM_INFO}">
										${ship.designation} / ${ship.techManufacturer}</p>
								</div>
								`;
				return markup;
			})
			.join("");

		return markup;
	}
}
export default new SearchDropdownView();
