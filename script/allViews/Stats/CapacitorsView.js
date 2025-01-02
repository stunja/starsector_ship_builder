import classNames from "../../helper/DomClassNames";
import DataSet from "../../helper/DataSet";
import View from "../view";

const BUTTON = {
	PLUS: "plus",
	MINUS: "minus",
};
class CapacitorsView extends View {
	_localParent = `.${classNames.shipCapacitorsContainer}`;
	generateMarkup() {
		const data = this._data;

		const markup = `
              ${this.#capacitorsMarkup(data)}
              ${this.#fluxCapacityMarkup(data)}
              `;
		return markup;
	}
	capacitorEventListeners(callback) {
		const parent = `.${classNames.shipCapacitors__Edit}`;
		const target = `.${classNames.buttonCircle}`;
		const parentTarget = this._localParentElement.querySelector(parent);

		this.addEventHandler(parentTarget, target, "click", (event) =>
			callback(event.target)
		);
	}
	#capacitorsMarkup(currentShipBuild) {
		return `
          <li class="${classNames.flexFlexEndGap} ${classNames.shipCapacitors__Edit}">
              <h5 class="${classNames.shipCapacitors__EditTitle}">Capacitors</h5>
              <button class="${classNames.button} ${classNames.buttonCircle} ${classNames.unselectable}" ${DataSet.dataButtonValue}="${BUTTON.MINUS}" ${DataSet.dataButtonName}="${classNames.shipCapacitors}">-</button>
              <h5 class="${classNames.shipCapacitors__Edit__Value}">${currentShipBuild.capacitors}</h5>
              <button class="${classNames.button} ${classNames.buttonCircle} ${classNames.unselectable}" ${DataSet.dataButtonValue}="${BUTTON.PLUS}" ${DataSet.dataButtonName}="${classNames.shipCapacitors}">+</button>
          </li>`;
	}
	#fluxCapacityMarkup(currentShipBuild) {
		return `
			${this.createList(
				classNames.shipCapacitors__FluxCapacity,
				"Flux Capacity",
				currentShipBuild.fluxCapacity
			)}
            `;
	}
}
export default new CapacitorsView();
