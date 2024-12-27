import classNames from "../../helper/DomClassNames";
import DataSet from "../../helper/DataSet";
import View from "../../allViews/view";

const BUTTON = {
	PLUS: "plus",
	MINUS: "minus",
};
class CapacitorsView extends View {
	render(state) {
		const localParent = `.${classNames.shipCapacitorsContainer}`;
		const currentShipBuild = state.currentShipBuild;

		const markup = `
              ${this.#capacitorsMarkup(currentShipBuild)}
              ${this.#fluxCapacityMarkup(currentShipBuild)}
              `;

		return [markup, localParent];
	}
	#capacitorsMarkup(currentShipBuild) {
		return `
          <li class="${classNames.flexFlexEndGap} ${classNames.shipCapacitors__Edit}">
              <h5 class="${classNames.shipCapacitors__EditTitle}">Capacitors</h5>
              <button class="${classNames.button} ${classNames.buttonCircle} ${classNames.unselectable} ${classNames.shipCapacitors__EditMinus}" ${DataSet.dataButtonValue}="${BUTTON.MINUS}" ${DataSet.dataButtonName}="${classNames.shipCapacitors}">-</button>
              <h5 class="${classNames.shipCapacitors__Edit__Value}">${currentShipBuild.currentCapacitors}</h5>
              <button class="${classNames.button} ${classNames.buttonCircle} ${classNames.unselectable} ${classNames.shipCapacitors__EditPlus}" ${DataSet.dataButtonValue}="${BUTTON.PLUS}" ${DataSet.dataButtonName}="${classNames.shipCapacitors}">+</button>
          </li>`;
	}
	#fluxCapacityMarkup(currentShipBuild) {
		return `
			${this.createList(
				classNames.shipCapacitors__FluxCapacity,
				"Flux Capacity",
				currentShipBuild.currentFluxCapacity
			)}
            `;
	}
}
export default new CapacitorsView();
