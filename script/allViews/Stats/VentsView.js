import classNames from "../../helper/DomClassNames";
import DataSet from "../../helper/DataSet";
import View from "../view";

const BUTTON = {
	PLUS: "plus",
	MINUS: "minus",
};
const STRINGS = {
	VENTS: "Vents",
	FLUX: "Flux Dissipation",
};
class VentsViews extends View {
	_localParent = `.${classNames.shipVents}`;

	generateMarkup() {
		const userShipBuild = this._data;
		const markup = `
            ${this.#ventsMarkup(userShipBuild.vents)}
            ${this.#fluxDissipationMarkup(userShipBuild.fluxDissipation)}
          `;

		return markup;
	}
	ventsEventListeners(callback) {
		const parent = `.${classNames.shipVents__Edit}`;
		const target = `.${classNames.buttonCircle}`;
		const parentTarget = this._localParentElement.querySelector(parent);

		this.addEventHandler(parentTarget, target, "click", (event) =>
			callback(event.target)
		);
	}
	#ventsMarkup(vents) {
		return `
            <li class="${classNames.flexFlexEndGap} ${classNames.shipVents__Edit}">
                   <h5>${STRINGS.VENTS}</h5>
                   <button class="${classNames.button} ${classNames.buttonCircle} ${classNames.unselectable} ${classNames.shipVents__EditMinus}" ${DataSet.dataButtonValue}="${BUTTON.MINUS}" ${DataSet.dataButtonName}="${classNames.shipVents}">-</button>
                   <h5 class="${classNames.shipVents__Edit__Value}">${vents}</h5>
                   <button class="${classNames.button} ${classNames.buttonCircle} ${classNames.unselectable} ${classNames.shipVents__EditPlus}" ${DataSet.dataButtonValue}="${BUTTON.PLUS}" ${DataSet.dataButtonName}="${classNames.shipVents}">+</button>
            </li>`;
	}
	#fluxDissipationMarkup(fluxDissipation) {
		return `
            <li class="${classNames.shipVents__FluxDissipation}">
                <h5>${STRINGS.FLUX}</h5>
                <p class="${classNames.shipVents__FluxDissipation__Value}">${fluxDissipation}</p>
            </li>`;
	}
}
export default new VentsViews();
