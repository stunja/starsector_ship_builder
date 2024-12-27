import classNames from "../../helper/DomClassNames";
import DataSet from "../../helper/DataSet";

const BUTTON = {
	PLUS: "plus",
	MINUS: "minus",
};

class VentsViews {
	render(state) {
		const localParent = `.${classNames.shipVents}`;

		const currentShipBuild = state.currentShipBuild;
		const fluxDissipation = currentShipBuild.currentFluxDissipation;

		const markup = `
            ${this.#ventsMarkup(currentShipBuild.currentVents)}
            ${this.#fluxDissipationMarkup(fluxDissipation)}
          `;

		return [markup, localParent];
	}
	#ventsMarkup(currentVents) {
		return `
            <li class="${classNames.flexFlexEndGap} ${classNames.shipVents__Edit}">
                   <h5>Vents</h5>
                   <button class="${classNames.button} ${classNames.buttonCircle} ${classNames.unselectable} ${classNames.shipVents__EditMinus}" ${DataSet.dataButtonValue}="${BUTTON.MINUS}" ${DataSet.dataButtonName}="${classNames.shipVents}">-</button>
                   <h5 class="${classNames.shipVents__Edit__Value}">${currentVents}</h5>
                   <button class="${classNames.button} ${classNames.buttonCircle} ${classNames.unselectable} ${classNames.shipVents__EditPlus}" ${DataSet.dataButtonValue}="${BUTTON.PLUS}" ${DataSet.dataButtonName}="${classNames.shipVents}">+</button>
            </li>`;
	}
	#fluxDissipationMarkup(currentFluxDissipation) {
		return `
            <li class="${classNames.shipVents__FluxDissipation}">
                <h5>Flux Dissipation</h5>
                <p class="${classNames.shipVents__FluxDissipation__Value}">${currentFluxDissipation}</p>
            </li>`;
	}
}
export default new VentsViews();
