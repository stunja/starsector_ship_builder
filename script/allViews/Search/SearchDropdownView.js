import CLASS_NAMES from "../../helper/ui/class_names";
import UI_DATASETS from "../../helper/ui/ui_datasets";
// View
import View from "../view";

const HINTS = {
	HIDE: {
		TARGET: "HIDE_IN_CODEX",
		STRING: "HIDE_IN_CODEX",
	},
	CIVILIAN: {
		TARGET: "civilian",
		STRING: "Civilian",
	},
	TRANSPORT: {
		TARGET: "transport",
		STRING: "Transport",
	},
	CARRIER: {
		TARGET: "carrier",
		STRING: "Carrier",
	},
	TANKER: {
		TARGET: "tanker",
		STRING: "Tanker",
	},
	COMBAT: {
		TARGET: "combat",
		STRING: "Combat",
	},
};

class SearchDropdownView extends View {
	_localParent = `.${CLASS_NAMES.SEARCH.DROPDOWN._BASE}`;

	generateMarkup() {
		const markup = this.#dropdownItems(this._data);
		return markup;
	}

	#dropdownItems(data) {
		const markup = data
			.map((ship) => {
				// hints
				const checkForMatchingHints = function (ship, target) {
					// console.log(ship);
					// console.log(target);
					if (ship.hints.includes(target.TARGET)) {
						return target.STRING;
					}
				};
				const additionalInformation = function () {
					// if (ship.hints.includes(HINTS.CIVILIAN.STRING)) {
					// 	return HINTS.CIVILIAN.STRING;
					// }
					// return "";

					const destination = ship.designation;
					const manufacturer = ship.techManufacturer;
					const markup = `${destination} | ${manufacturer} | ${checkForMatchingHints(
						ship,
						HINTS.CIVILIAN
					)}`;
					return markup;
				};
				const markup = `
								<div class="${CLASS_NAMES.SEARCH.DROPDOWN.ITEM}" 
									${UI_DATASETS.NAV.DROPDOWN.FUNC(ship.id)}
								>
									<p class="${CLASS_NAMES.SEARCH.DROPDOWN.ITEM_NAME}">${ship.name}</p>
									<p class="${CLASS_NAMES.SEARCH.DROPDOWN.ITEM_INFO}">
										${additionalInformation()}
									</p>
								</div>
								`;
				return markup;
			})
			.join("");

		return markup;
	}
}
export default new SearchDropdownView();
