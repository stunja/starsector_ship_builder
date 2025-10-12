// View
import View from "../view";
// Helper
import CLASS_NAMES from "../../helper/ui/class_names";
import URL from "../../helper/url";

class ShipAreaView extends View {
	_localParent = `.${CLASS_NAMES.shipAreaContainer}`;

	generateMarkup() {
		const data = this._data;
		const markup = `${this.#structureMarkup(data)}`;

		return markup;
	}

	#structureMarkup(currentShip) {
		return `
				<div class="${CLASS_NAMES.weaponPopUp}"></div>
                <ul class="${CLASS_NAMES.shipAndWeaponsHolder}">
                  	<li class="${CLASS_NAMES.weaponSlotsHolder}">
                    	<ul class="${CLASS_NAMES.weaponSlots}"></ul>
                  	</li>
                  	<img src="/${URL.DATA}/${currentShip.secondaryData.spriteName}" alt="${currentShip.spriteName}" class="${CLASS_NAMES.shipSprite}" />
                </ul>
                  `;
	}
}
export default new ShipAreaView();
