import CLASS_NAMES from "../../helper/ui/class_names";
import UI_DATASETS from "../../helper/ui/ui_datasets";
import FONT_ICONS_MARKUP from "../../helper/ui/font_icons_markup";
import { SHIP_HINTS_STRINGS } from "../../helper/ui/ui_strings";
// View
import NewView from "../NewView";

export default class SearchDropdownView extends NewView {
	static LOCAL_PARENT = CLASS_NAMES.SEARCH.DROPDOWN._BASE;

	_generateMarkup() {
		const allShipHulls = this.model;
		const markup = allShipHulls
			.map((ship) => {
				const hullSize = ship.additionalData.hullSize;
				const shipId = ship.id;
				const shipName = ship.name;
				const shipInfo = this.#formatShipInfo(ship);
				const markup = `
								<div class="${CLASS_NAMES.SEARCH.DROPDOWN.ITEM} ${hullSize.toLowerCase()}" 
									${UI_DATASETS.NAV.DROPDOWN.FUNC(shipId)}
								>
									${FONT_ICONS_MARKUP[hullSize]}
									<div class="${CLASS_NAMES.SEARCH.DROPDOWN.ITEM_INFO}">
										<p>${shipName}</p>
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

	_setupEventListeners() {
		this._onClick(CLASS_NAMES.SEARCH.DROPDOWN.ITEM, this._callbacks.click);
		// this.mouseClick(
		// 	CLASS_NAMES.SEARCH.DROPDOWN.ITEM,
		// 	this.#onItemSelectionCallback,
		// );
		// this.closePopUpContainerIfUserClickOutside(
		// 	CLASS_NAMES.SEARCH.DROPDOWN._BASE,
		// 	this.#onClickOutsideContainerCallback,
		// );
	}
}
