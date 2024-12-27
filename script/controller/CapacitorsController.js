import * as model from "../model";
import StatsController from "./StatsController";

const BUTTON_ACTIONS = {
	PLUS: "plus",
	MINUS: "minus",
};

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
		const updateCapacitorsState = this.#setNewCapacitorsValue(
			currentCapacitors + increment
		);
		const finalState = this.#updateFluxCapacityValue(updateCapacitorsState);

		if (finalState) {
			model.state.currentShipBuild = finalState;
			StatsController.capacitorsAndFluxCapacity();
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
	// Increase in number of capacitors increase flux capacity.
	#updateFluxCapacityValue(currentState) {
		// Base Flux is default flux for a ship
		// currentCapacitors are current number of capacitors on a ship between 0 and max capacitors
		// fluxCapacity per shit is value based on shipSize (Capital ship === 200)
		const newFluxCapacity =
			currentState._baseFluxCapacity +
			currentState.currentCapacitors *
				currentState.currentFluxCapacityPerSingleActiveCapacitor;

		return { ...currentState, currentFluxCapacity: newFluxCapacity };
	}
}
export default new CapacitorsController();
