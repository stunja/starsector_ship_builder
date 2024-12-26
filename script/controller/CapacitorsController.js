import * as model from "../model";
import StatsController from "./StatsController";

const BUTTON_ACTIONS = {
	PLUS: "plus",
	MINUS: "minus",
};
//! Unfinised Flux / Cap not implemented
class CapacitorsController {
	changeValue = (btn) => {
		const buttonValue = btn.dataset.buttonValue;

		// Should be only, just in case
		if (
			buttonValue !== BUTTON_ACTIONS.PLUS &&
			buttonValue !== BUTTON_ACTIONS.MINUS
		)
			return;

		const currentCapacitors = model.state.currentShipBuild.currentCapacitors;
		// Trying ot use ENUMS
		const increment = buttonValue === BUTTON_ACTIONS.PLUS ? 1 : -1;

		// Update State
		const newState = this.#setNewCapacitorsValue(currentCapacitors + increment);

		if (newState) {
			model.state.currentShipBuild = newState;
			StatsController.capacitors();
		}
	};

	#setNewCapacitorsValue(newCapacitorsValue) {
		// not needed as only numbers are possible
		if (typeof newCapacitorsValue !== "number") {
			return null;
		}

		// defense from overflow
		if (
			newCapacitorsValue < 0 ||
			newCapacitorsValue > model.state.currentShipBuild.maxCapacitors
		) {
			return model.state.currentShipBuild;
		}

		return {
			...model.state.currentShipBuild,
			currentCapacitors: newCapacitorsValue,
		};
	}

	// changeCurrentActiveCapacitors(btn) {
	// 	const buttonValue = btn.dataset.buttonValue;
	// 	const { activeCapacitors, maxCapacitors } = model.state.currentShipBuild;

	// 	if (buttonValue < 0 && activeCapacitors > 0)
	// 		this.#changeCurrentCapacitors(-1);
	// 	if (buttonValue > 0 && activeCapacitors < maxCapacitors)
	// 		this.#changeCurrentCapacitors(+1);
	// }

	#changeCurrentCapacitors(value) {
		const currentShipBuild = model.state.currentShipBuild;

		currentShipBuild.activeCapacitors += value;

		ordinancePointsController.updateCurrentOrdinancePoints(
			currentShipBuild.activeCapacitorsOrdinanceCost + value - 1 // -1 because I give value in dataset -1 / +1
		);
		this.#increaseDecreaseCurrentFluxCapacity(value);
		capacitorRender();
	}

	#increaseDecreaseCurrentFluxCapacity(value = 0) {
		const { currentFluxCapacity, currentFluxCapacityPerSingleActiveCapacitor } =
			model.state.currentShipBuild;

		if (value === -1) {
			model.state.currentShipBuild.currentFluxCapacity =
				currentFluxCapacity - currentFluxCapacityPerSingleActiveCapacitor;
		}
		if (value === 1) {
			model.state.currentShipBuild.currentFluxCapacity =
				currentFluxCapacity + currentFluxCapacityPerSingleActiveCapacitor;
		}
	}
	fluxCapacityCalcBasedOnActiveCapacitors() {
		// used for resetData function
		const {
			_baseFluxCapacity,
			activeCapacitors,
			currentFluxCapacityPerSingleActiveCapacitor,
		} = model.state.currentShipBuild;

		model.state.currentShipBuild.currentFluxCapacity =
			_baseFluxCapacity +
			activeCapacitors * currentFluxCapacityPerSingleActiveCapacitor;
	}
}
export default new CapacitorsController();
