// View Functions
import View from "../../allViews/view";
// Helper Functions
import CLASS_NAMES from "../../helper/ui/class_names";
import { GENERIC_STRING } from "../../helper/ui/ui_main";

const SHIELD_TYPE = {
	SHIELD_FRONT: "FRONT",
	SHIELD_OMNI: "OMNI",
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
	_localParent = `.${CLASS_NAMES.phaseOrShieldContainer}`;

	generateMarkup() {
		const userShipBuild = this._data;

		const shieldTypeRenderers = {
			[SHIELD_TYPE.SHIELD_FRONT]: () => this.#shieldDataRender(userShipBuild),
			[SHIELD_TYPE.SHIELD_OMNI]: () => this.#shieldDataRender(userShipBuild),
			[SHIELD_TYPE.PHASE]: () => this.#phaseDataRender(userShipBuild),
			[SHIELD_TYPE.NO_SHIELD]: () => this.#noShieldDataRender(),
		};

		const markup =
			shieldTypeRenderers[userShipBuild.shieldType]?.() || GENERIC_STRING.EMPTY;

		return markup;
	}

	#phaseDataRender(state) {
		const { upkeepString, activationCostString } =
			this.#calculatePhaseValues(state);

		if (upkeepString === 0 && activationCostString === 0)
			return GENERIC_STRING.EMPTY;

		return `
            <ul class="${CLASS_NAMES.flexFlexEndGap} ${CLASS_NAMES.shieldFlux}">
				${this.createList(
					CLASS_NAMES.phaseFlux__PerSec,
					PHASE_TITLES.PER_SEC,
					upkeepString
				)}
				${this.createList(
					CLASS_NAMES.phaseFlux__Activation,
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
            <ul class="${CLASS_NAMES.flexFlexEndGap} ${CLASS_NAMES.shieldFlux}">
				${this.createList(CLASS_NAMES.shieldArc, SHIELD_TITLES.ARC, shieldArc)}
				${this.createList(
					CLASS_NAMES.shieldFlux__PerSec,
					SHIELD_TITLES.PER_SEC,
					fluxPerSec
				)}
				${this.createList(
					CLASS_NAMES.shieldFlux__PerDmg,
					SHIELD_TITLES.PER_DMG,
					fluxPerDmg
				)}
            </ul>
          `;
	}
	#noShieldDataRender() {
		return `
            <ul class="${CLASS_NAMES.flexFlexEndGap} ${CLASS_NAMES.shieldFlux}">
				${this.createList(CLASS_NAMES.shieldArc, SHIELD_TITLES.ARC, NO_SHIELD_ICON)}
				${this.createList(
					CLASS_NAMES.shieldFlux__PerSec,
					SHIELD_TITLES.PER_SEC,
					NO_SHIELD_ICON
				)}
				${this.createList(
					CLASS_NAMES.shieldFlux__PerDmg,
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
