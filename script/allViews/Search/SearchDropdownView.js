import CLASS_NAMES from "../../helper/ui/class_names";
import UI_DATASETS from "../../helper/ui/ui_datasets";
// View
import View from "../view";

// find hint and show it as a string
const HINTS = {
	HIDE: "Special",
	CIVILIAN: "Civilian",
	TRANSPORT: "Transport",
	CARRIER: "Carrier",
	TANKER: "Tanker",
	COMBAT: "Combat",
	FREIGHTER: "Freighter",
};

class SearchDropdownView extends View {
	_localParent = `.${CLASS_NAMES.SEARCH.DROPDOWN._BASE}`;

	generateMarkup() {
		const markup = this.#dropdownItems(this._data);
		return markup;
	}

	#dropdownItems(data) {
		console.log(data);
		const markup = data
			.map((ship) => {
				const shipInfo = this.#shipAdditionalInformation(ship);
				const markup = `
								<div class="${CLASS_NAMES.SEARCH.DROPDOWN.ITEM}" 
									${UI_DATASETS.NAV.DROPDOWN.FUNC(ship.id)}
								>
									<p class="${CLASS_NAMES.SEARCH.DROPDOWN.ITEM_NAME}">${ship.name}</p>
									<p class="${CLASS_NAMES.SEARCH.DROPDOWN.ITEM_INFO}">
										${shipInfo}
									</p>
								</div>
								`;
				return markup;
			})
			.join("");

		return markup;
	}
	#shipAdditionalInformation(ship) {
		const destination = ship.designation;
		const manufacturer = ship.techManufacturer;
		const hints = ship.hints.toLowerCase(); // could have couple of parameters

		const processedHints = Object.entries(HINTS)
			.map(([target, stringToReplace]) => {
				if (hints.includes(target.toLowerCase())) {
					return stringToReplace;
				}
			})
			.filter((item) => item);

		const markup = [destination, manufacturer, ...processedHints].join(" | ");
		return markup;
	}
}
export default new SearchDropdownView();
