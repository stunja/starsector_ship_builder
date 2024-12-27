import classNames from "../../helper/DomClassNames";
import DataSet from "../../helper/DataSet";

class CapacitorsView {
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
              <button class="${classNames.button} ${classNames.buttonCircle} ${classNames.unselectable} ${classNames.shipCapacitors__EditMinus}" ${DataSet.dataButtonValue}="minus">-</button>
              <h5 class="${classNames.shipCapacitors__Edit__Value}">${currentShipBuild.currentCapacitors}</h5>
              <button class="${classNames.button} ${classNames.buttonCircle} ${classNames.unselectable} ${classNames.shipCapacitors__EditPlus}" ${DataSet.dataButtonValue}="plus">+</button>
          </li>`;
	}
	#fluxCapacityMarkup(currentShipBuild) {
		return `
            <li class="${classNames.shipCapacitors__FluxCapacity}">
              <h5 class="${classNames.fluxCapacity__Title}">Flux Capacity</h5>
              <p class="${classNames.fluxCapacity__Value}">${currentShipBuild.currentFluxCapacity}</p>
             </li>`;
	}
}
export default new CapacitorsView();
