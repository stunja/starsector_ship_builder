import View from "../view";

// helper
import CLASS_NAMES from "../../helper/ui/class_names";
import DATASET from "../../helper/ui/datasets";

const BUTTON = {
	PLUS: "plus",
	MINUS: "minus",
};
class CapacitorsView extends View {
	_localParent = `.${CLASS_NAMES.shipCapacitorsContainer}`;
	#currentShipBuild;

	generateMarkup() {
		const data = this._data;
		this.#processData(data);

		const markup = `
              ${this.#capacitorsMarkup(data)}
              ${this.#fluxCapacityMarkup(data)}
              `;
		return markup;
	}
	#processData(data) {
		this.#currentShipBuild = data;
	}
	#capacitorsMarkup(currentShipBuild) {
		return `
          <li class="${CLASS_NAMES.flexFlexEndGap} ${CLASS_NAMES.shipCapacitors__Edit}">
              <h5 class="${CLASS_NAMES.shipCapacitors__EditTitle}">Capacitors</h5>
              <button class="${CLASS_NAMES.button} ${CLASS_NAMES.buttonCircle} ${CLASS_NAMES.unselectable} ${CLASS_NAMES.shipCapacitors__Button}" ${DATASET.dataButtonValue}="${BUTTON.MINUS}" ${DATASET.dataButtonName}="${CLASS_NAMES.shipCapacitors}">-</button>
              <h5 class="${CLASS_NAMES.shipCapacitors__Edit__Value}">${currentShipBuild.capacitors}</h5>
              <button class="${CLASS_NAMES.button} ${CLASS_NAMES.buttonCircle} ${CLASS_NAMES.unselectable} ${CLASS_NAMES.shipCapacitors__Button}" ${DATASET.dataButtonValue}="${BUTTON.PLUS}" ${DATASET.dataButtonName}="${CLASS_NAMES.shipCapacitors}">+</button>
          </li>`;
	}
	#fluxCapacityMarkup(currentShipBuild) {
		return `
			${this.createList(
				CLASS_NAMES.shipCapacitors__FluxCapacity,
				"Flux Capacity",
				currentShipBuild.fluxCapacity
			)}
            `;
	}
}
export default new CapacitorsView();
