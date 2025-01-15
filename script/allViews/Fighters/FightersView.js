import classNames from "../../helper/DomClassNames";
import DataSet from "../../helper/DataSet";
import View from "../view";

const STRING = {
	HEADER: "Fighter Bays",
};
//! Only Render of Container Implemented so far.
class FightersView extends View {
	_localParent = `.${classNames.fighterContainer}`;

	generateMarkup() {
		const data = this._data;
		const markup = `${this.#fighterContainerMarkup(data)}`;
		return markup;
	}
	#fighterSlotsMarkup(arr) {
		return arr
			.map(
				(fighterSlot) =>
					`
                        <div class="${classNames.fighterSlotContainer}">
                            <figure class="${classNames.smallImageBox} ${classNames.fighterSlot}" 
                                ${DataSet.dataFighterId}="${fighterSlot.id}"
                            >
                            </figure>
                        </div>
                    `
			)
			.join("");
	}

	#createFighterSlotsArray = (currentShip) =>
		currentShip.weaponSlots.filter(
			(fighterObject) => fighterObject.type === "LAUNCH_BAY"
		);

	#fighterContainerMarkup(currentShip) {
		const fighterArray = this.#createFighterSlotsArray(currentShip);
		if (fighterArray.length === 0) return "";

		return `
	        <ul class="${classNames.fighterSlotsContainer}">
	          <li class=
                "${classNames.fighterSlotsContainerHeader}"
                >
                <h5>${STRING.HEADER}</h5>
              </li>
	          <li class="${classNames.fighterSlots}">
	            ${this.#fighterSlotsMarkup(fighterArray)}
	          </li>
			  <div class="${classNames.fighterPopUp}"></div>
	        </ul>
	`;
	}
}
export default new FightersView();
