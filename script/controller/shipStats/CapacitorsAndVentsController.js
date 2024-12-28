import * as model from "../../model";
import StatsController from "./StatsController";

const CONTROLS = {
	BUTTON_ACTIONS: {
		PLUS: "plus",
		MINUS: "minus",
	},
	TYPE: {
		CAPACITORS: "capacitors",
		VENTS: "vents",
	},
};
const SHIP_SYSTEMS = {
	// Dont confuse CAPACITY and CAPACITOR
	CAPACITORS: {
		CURRENT: "currentCapacitors",
		MAX: "maxCapacitors",
	},
	FLUXCAP: {
		BASE: "_baseFluxCapacity",
		FIRST_VALUE: "currentCapacitors",
		SECOND_VALUE: "currentFluxCapacity",
		FLUX_PER_VALUE: "currentFluxCapacityPerSingleActiveCapacitor",
	},
	VENTS: {
		CURRENT: "currentVents",
		MAX: "maxVents",
	},
	FLUX_DISSIPATION: {
		BASE: "_baseFluxDissipation",
		FIRST_VALUE: "currentVents",
		SECOND_VALUE: "currentFluxDissipation",
		FLUX_PER_VALUE: "currentFluxDissipationPerSingleActiveVent",
	},
};

// Joined Capacitor and Vents controller
// mostly identical
class CapacitorsAndVentsController {
	// Not ideal, but it prevents conflict with eventHandlers
	// Plus use arrow functions when inject dataset. Gives an error, due to eventListener implementation
	handleCapacitorChange = (btn) => {
		this.#changeValue(btn, CONTROLS.TYPE.CAPACITORS);
	};
	handleVentChange = (btn) => {
		this.#changeValue(btn, CONTROLS.TYPE.VENTS);
	};

	#changeValue = (btn, controllerType) => {
		const { buttonValue } = btn.dataset;
		const { currentShipBuild } = model.state;

		// Should be only, just in case

		if (!Object.values(CONTROLS.BUTTON_ACTIONS).includes(buttonValue)) return;

		// Trying ot use ENUMS
		const increment = buttonValue === CONTROLS.BUTTON_ACTIONS.PLUS ? 1 : -1;

		// Update State
		if (controllerType === CONTROLS.TYPE.CAPACITORS) {
			model.state.currentShipBuild = this.#updateCapacitor(
				currentShipBuild,
				increment
			);
			StatsController.capacitorsAndFluxCapacity();
		} else {
			model.state.currentShipBuild = this.#updateVents(
				currentShipBuild,
				increment
			);
			StatsController.ventsAndFluxDissipation();
		}
	};
	#updateCapacitor(currentState, increment) {
		// Base Flux is default flux for a ship
		// currentCapacitors are current number of capacitors on a ship between 0 and max capacitors
		// fluxCapacity per shit is value based on shipSize (Capital ship === 200)
		const updatedState = this.#updateSystemValue(
			currentState,
			increment,
			SHIP_SYSTEMS.CAPACITORS
		);

		return this.#updateDeriveValue(updatedState, SHIP_SYSTEMS.FLUXCAP);
	}
	#updateVents(currentState, increment) {
		const updatedState = this.#updateSystemValue(
			currentState,
			increment,
			SHIP_SYSTEMS.VENTS
		);

		return this.#updateDeriveValue(updatedState, SHIP_SYSTEMS.FLUX_DISSIPATION);
	}

	#updateSystemValue(state, increment, system) {
		const newValue = state[system.CURRENT] + increment;

		// defense from overflow
		if (newValue < 0 || newValue > state[system.MAX]) {
			return state;
		}

		return {
			...state,
			[system.CURRENT]: newValue,
		};
	}
	// Increase in number of capacitors increase flux capacity.
	#updateDeriveValue(state, target) {
		return {
			...state,
			[target.SECOND_VALUE]:
				state[target.BASE] +
				state[target.FIRST_VALUE] * state[target.FLUX_PER_VALUE],
		};
	}
}
export default new CapacitorsAndVentsController();
