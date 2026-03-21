import CLASS_NAMES from "../../helper/ui/class_names";
import UI_DATASETS from "../../helper/ui/ui_datasets";
import FONT_ICONS_MARKUP from "../../helper/ui/font_icons_markup";
import { SHIP_HINTS_STRINGS } from "../../helper/ui/ui_strings";
// View
import View from "../view";

class SearchDropdownView extends View {
	_localParent = `.${CLASS_NAMES.SEARCH.DROPDOWN._BASE}`;

	generateMarkup() {
		const markup = this.#dropdownItems(this._data);
		return markup;
	}

	#dropdownItems(data) {
		const markup = data
			.map((ship) => {
				const hullSize = ship.additionalData.hullSize;
				const shipInfo = this.#formatShipInfo(ship);
				const markup = `
								<div class="${CLASS_NAMES.SEARCH.DROPDOWN.ITEM} ${hullSize.toLowerCase()}" 
									${UI_DATASETS.NAV.DROPDOWN.FUNC(ship.id)}
								>
									${FONT_ICONS_MARKUP[hullSize]}
									<div class="${CLASS_NAMES.SEARCH.DROPDOWN.ITEM_INFO}">
										<p>${ship.name}</p>
										<p>${shipInfo}</p>
									</div>
									${FONT_ICONS_MARKUP.SWAP_ICON}
								</div>
								`;
				return markup;
			})
			.join("");

		return markup;
	}

	#convertHints(rawHints) {
		const normalize = rawHints.toUpperCase(); // same logic as in UI strings
		return Object.entries(SHIP_HINTS_STRINGS).flatMap(([token, label]) =>
			normalize.includes(token) ? [label] : [],
		);
	}
	#formatShipInfo(ship) {
		const info = [
			ship.designation,
			ship.techManufacturer,
			...this.#convertHints(ship.hints),
		];
		return info.filter(Boolean).join(" / ");
	}
}
export default new SearchDropdownView();
