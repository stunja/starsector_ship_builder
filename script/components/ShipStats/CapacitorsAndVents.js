import ViewModel from "../../ViewModel";

import CapacitorsView from "../../allViews/Stats/CapacitorsView";
import VentsView from "../../allViews/Stats/VentsView";
import classNames from "../../helper/DomClassNames";

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
const EVENT_LISTENER_TARGET = {
	CAPACITOR: `.${classNames.shipCapacitors__Button}`,
	VENTS: `.${classNames.shipVents__Button}`,
};
const EVENT_LISTENER_TYPE = {
	CLICK: `click`,
};
const SHIP_SYSTEMS = {
	// Dont confuse CAPACITY and CAPACITOR
	CAPACITORS: {
		CURRENT: "capacitors",
		MAX: "maxCapacitors",
	},
	FLUXCAP: {
		CAPACITY: "fluxCapacity",
		SELECTOR: "capacitors",
		FLUX_PER_VALUE: "fluxCapacityPerSingleActiveCapacitor",
	},
	VENTS: {
		CURRENT: "vents",
		MAX: "maxVents",
	},
	FLUX_DISSIPATION: {
		CAPACITY: "fluxDissipation",
		SELECTOR: "vents",
		FLUX_PER_VALUE: "fluxDissipationPerSingleActiveVent",
	},
};

// Joined Capacitor and Vents controller
// mostly identical
export default class CapacitorsAndVents extends ViewModel {
	constructor(model) {
		super(model);
	}
	update() {
		this.capacitorUpdate();
		this.ventsUpdate();
	}
	capacitorUpdate() {
		CapacitorsView.render(this.getUserShipBuild());
		CapacitorsView.addClickHandler(
			EVENT_LISTENER_TARGET.CAPACITOR,
			EVENT_LISTENER_TYPE.CLICK,
			this.handleCapacitorChange
		);
	}
	ventsUpdate() {
		VentsView.render(this.getUserShipBuild());
		VentsView.addClickHandler(
			EVENT_LISTENER_TARGET.VENTS,
			EVENT_LISTENER_TYPE.CLICK,
			this.handleVentChange
		);
	}

	// Not ideal, but it prevents conflict with eventHandlers
	// Plus use arrow functions when inject dataset. Gives an error, due to eventListener implementation
	handleCapacitorChange = (btn) => {
		this.#changeValue(btn, CONTROLS.TYPE.CAPACITORS);
	};

	#changeValue = (btn, controllerType) => {
		const { buttonValue } = btn.dataset;
		const userShipBuild = this.getUserShipBuild();
		console.log(userShipBuild);
		// Should be only, just in case

		if (!Object.values(CONTROLS.BUTTON_ACTIONS).includes(buttonValue)) return;

		// Trying ot use ENUMS
		const increment = buttonValue === CONTROLS.BUTTON_ACTIONS.PLUS ? 1 : -1;

		if (controllerType === CONTROLS.TYPE.CAPACITORS) {
			const newShipBuild = this.#updateCapacitor(userShipBuild, increment);
			this.setUpdateUserShipBuild(newShipBuild);
			this.capacitorUpdate();
		} else {
			const newShipBuild = this.#updateVents(userShipBuild, increment);
			this.setUpdateUserShipBuild(newShipBuild);
			this.ventsUpdate();
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
	// Vents
	handleVentChange = (btn) => {
		this.#changeValue(btn, CONTROLS.TYPE.VENTS);
	};
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
		// a hack, but it works
		const _baseState = this._getBaseShipBuild();

		return {
			...state,
			[target.CAPACITY]:
				_baseState[target.CAPACITY] +
				state[target.SELECTOR] * state[target.FLUX_PER_VALUE],
		};
	}
}
