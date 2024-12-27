import View from "../../allViews/view";
import classNames from "../../helper/DomClassNames";

const SHIELD_TYPE = {
	SHIELD: "shieldShip",
	PHASE: "phaseShip",
	NO_SHIELD: "noShieldShip",
};
const SHIELD_TITLES = {
	ARC: "Shield Arc",
	PER_SEC: "Shield Flux / Sec",
	PER_DMG: "Shield Flux / Dmg",
};
const PHASE_TITLES = {
	ACTIVATION: "Cloak Activation Cost",
	PER_SEC: "Cloak Flux / Sec",
};
const NO_SHIELD_ICON = "---";

class ShieldOrPhaseView extends View {
	render(state) {
		const localParent = `.${classNames.phaseOrShieldContainer}`;

		const shieldTypeRenderers = {
			[SHIELD_TYPE.SHIELD]: () =>
				this.#shieldDataRender(state.currentShipBuild),
			[SHIELD_TYPE.PHASE]: () => this.#phaseDataRender(state.currentShipBuild),
			[SHIELD_TYPE.NO_SHIELD]: () => this.#noShieldDataRender(),
		};
		const markup =
			shieldTypeRenderers[state.currentShipBuild.currentShipType]?.() || "";

		return [markup, localParent];
	}
	#calculatePhaseValues(state) {
		// I have no idea why this solves the issue, but it is.
		// Checked correct numbers with DOOM // SHADE // HARBRINGER
		// DOOM 500 / 500 = 0.05 / 0.05
		// Harbrider 250 / 200 = 0.05 / 0.04
		// currentFluxCapacity: 5000
		return {
			upkeepString: state.currentFluxCapacity * state.phaseUpkeep,
			activationCostString: state.currentFluxCapacity * state.phaseCost,
		};
	}
	#calculateShieldValues(state) {
		return {
			arc: state.currentShieldArc,
			fluxPerSec: state._baseFluxDissipation * state.currentShieldUpkeep,
			fluxPerDmg: state.currentShieldEfficiency,
		};
	}
	//! make it generic func
	// #createList(classes, title, str) {
	// 	return `
	// 		<li class="${classes}">
	//             <h5>${title}</h5>
	//             <p>${str}</p>
	//         </li>`;
	// }
	#phaseDataRender(state) {
		const { upkeepString, activationCostString } =
			this.#calculatePhaseValues(state);

		return `
            <ul class="${classNames.flexFlexEndGap} ${classNames.shieldFlux}">
				${this.createList(
					classNames.phaseFlux__PerSec,
					PHASE_TITLES.PER_SEC,
					upkeepString
				)}
				${this.createList(
					classNames.phaseFlux__Activation,
					PHASE_TITLES.ACTIVATION,
					activationCostString
				)}
            </ul>
          `;
	}
	#shieldDataRender(state) {
		const {
			arc: shieldArc,
			fluxPerSec,
			fluxPerDmg,
		} = this.#calculateShieldValues(state);

		return `
            <ul class="${classNames.flexFlexEndGap} ${classNames.shieldFlux}">
				${this.createList(classNames.shieldArc, SHIELD_TITLES.ARC, shieldArc)}
				${this.createList(
					classNames.shieldFlux__PerSec,
					SHIELD_TITLES.PER_SEC,
					fluxPerSec
				)}
				${this.createList(
					classNames.shieldFlux__PerDmg,
					SHIELD_TITLES.PER_DMG,
					fluxPerDmg
				)}
            </ul>
          `;
	}
	#noShieldDataRender() {
		return `
            <ul class="${classNames.flexFlexEndGap} ${classNames.shieldFlux}">
				${this.createList(classNames.shieldArc, SHIELD_TITLES.ARC, NO_SHIELD_ICON)}
				${this.createList(
					classNames.shieldFlux__PerSec,
					SHIELD_TITLES.PER_SEC,
					NO_SHIELD_ICON
				)}
				${this.createList(
					classNames.shieldFlux__PerDmg,
					SHIELD_TITLES.PER_DMG,
					NO_SHIELD_ICON
				)}
            </ul>
          `;
	}
}
export default new ShieldOrPhaseView();
