import View from "../view";
// helper
import CLASS_NAMES from "../../helper/ui/class_names";
import DATASET from "../../helper/ui/datasets";

const BUTTON = {
	PLUS: "plus",
	MINUS: "minus",
};
const STRINGS = {
	VENTS: "Vents",
	FLUX: "Flux Dissipation",
};
class VentsViews extends View {
	_localParent = `.${CLASS_NAMES.shipVents}`;

	generateMarkup() {
		const userShipBuild = this._data;
		const markup = `
            ${this.#ventsMarkup(userShipBuild.vents)}
            ${this.#fluxDissipationMarkup(userShipBuild.fluxDissipation)}
          `;

		return markup;
	}

	#ventsMarkup(vents) {
		return `
            <li class="${CLASS_NAMES.flexFlexEndGap} ${CLASS_NAMES.shipVents__Edit}">
                   <h5>${STRINGS.VENTS}</h5>
                   <button class="${CLASS_NAMES.button} ${CLASS_NAMES.buttonCircle} ${CLASS_NAMES.shipVents__Button} ${CLASS_NAMES.unselectable} ${CLASS_NAMES.shipVents__EditMinus}" ${DATASET.dataButtonValue}="${BUTTON.MINUS}" ${DATASET.dataButtonName}="${CLASS_NAMES.shipVents}">-</button>
                   <h5 class="${CLASS_NAMES.shipVents__Edit__Value}">${vents}</h5>
                   <button class="${CLASS_NAMES.button} ${CLASS_NAMES.buttonCircle} ${CLASS_NAMES.shipVents__Button} ${CLASS_NAMES.unselectable} ${CLASS_NAMES.shipVents__EditPlus}" ${DATASET.dataButtonValue}="${BUTTON.PLUS}" ${DATASET.dataButtonName}="${CLASS_NAMES.shipVents}">+</button>
            </li>`;
	}
	#fluxDissipationMarkup(fluxDissipation) {
		return `
            <li class="${CLASS_NAMES.shipVents__FluxDissipation}">
                <h5>${STRINGS.FLUX}</h5>
                <p class="${CLASS_NAMES.shipVents__FluxDissipation__Value}">${fluxDissipation}</p>
            </li>`;
	}
}
export default new VentsViews();
