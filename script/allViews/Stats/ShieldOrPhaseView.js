import View from "../../allViews/view";
import classNames from "../../helper/DomClassNames";

const SHIELD_TYPE = {
	SHIELD: "FRONT" || "OMNI",
	PHASE: "PHASE",
	NO_SHIELD: "",
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
	_localParent = `.${classNames.phaseOrShieldContainer}`;

	generateMarkup() {
		const userShipBuild = this._data;

		const shieldTypeRenderers = {
			[SHIELD_TYPE.SHIELD]: () => this.#shieldDataRender(userShipBuild),
			[SHIELD_TYPE.PHASE]: () => this.#phaseDataRender(userShipBuild),
			[SHIELD_TYPE.NO_SHIELD]: () => this.#noShieldDataRender(),
		};

		const markup = shieldTypeRenderers[userShipBuild.shieldType]?.() || "";

		return markup;
	}

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

	#calculateShieldValues(data) {
		return {
			arc: data.shieldArc,
			fluxPerSec: 200 * data.shieldUpkeep,
			fluxPerDmg: data.shieldEfficiency,
		};
	}

	#calculatePhaseValues(data) {
		// I have no idea why this solves the issue, but it is.
		// Checked correct numbers with DOOM // SHADE // HARBRINGER
		// DOOM 500 / 500 = 0.05 / 0.05
		// Harbrider 250 / 200 = 0.05 / 0.04
		// currentFluxCapacity: 5000
		return {
			upkeepString: data.fluxCapacity * data.phaseUpkeep,
			activationCostString: data.fluxCapacity * data.phaseCost,
		};
	}
}
export default new ShieldOrPhaseView();
