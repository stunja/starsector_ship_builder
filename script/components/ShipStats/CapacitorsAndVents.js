// View Model
import ViewModel from "../../ViewModel";

// Views
import CapacitorsView from "../../allViews/Stats/CapacitorsView";
import OrdinancePointsView from "../../allViews/Stats/OrdinancePointsView";

import VentsView from "../../allViews/Stats/VentsView";
import classNames from "../../helper/DomClassNames";

// import ShipStats from "./ShipStats";

const CONTROLS = {
	BUTTON_ACTIONS: {
		PLUS: "plus",
		MINUS: "minus",
	},
	BUTTON_DATASET: {
		SHIP_CAPACITORS: "ship-capacitors",
		SHIP_VENTS: "ship-vents",
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
	#currentFluxCapacity;
	#currentFluxDissipation;

	constructor(model) {
		super(model);
	}
	update() {
		this.#processData();
		this.#capacitorHandler();

		this.#ventsHandler();
		this.#updateValues();
	}
	#processData() {
		this.#currentFluxCapacity = this.getUserShipBuild().fluxCapacity;
		this.#currentFluxDissipation = this.getUserShipBuild().fluxDissipation;
	}
	#updateValues() {
		const userShipBuild = this.getUserShipBuild();

		const {
			fluxCapacity,
			fluxCapacityPerSingleActiveCapacitor,
			capacitors,
			capacitorsOrdinanceCost,
			ordinancePoints,
			fluxDissipation,
			vents,
			fluxDissipationPerSingleActiveVent,
		} = userShipBuild;

		const updateFluxCapacity =
			this.#currentFluxCapacity +
			fluxCapacityPerSingleActiveCapacitor * capacitors;

		const updateFluxDissipation =
			this.#currentFluxDissipation + fluxDissipationPerSingleActiveVent * vents;

		const updateOrdinanceCost = capacitors * capacitorsOrdinanceCost;

		this.setUpdateUserShipBuild({
			...userShipBuild,
			ordinancePoints: updateOrdinanceCost,
			fluxCapacity: updateFluxCapacity,
			fluxDissipation: updateFluxDissipation,
		});

		OrdinancePointsView.render(this.getUserShipBuild());
		this.#capacitorHandler();
		this.#ventsHandler();
	}
	#capacitorHandler() {
		CapacitorsView.render(this.getUserShipBuild());

		CapacitorsView.addClickHandler(
			EVENT_LISTENER_TARGET.CAPACITOR,
			EVENT_LISTENER_TYPE.CLICK,
			this.#handleButtonChange
		);
	}
	#ventsHandler() {
		VentsView.render(this.getUserShipBuild());

		VentsView.addClickHandler(
			EVENT_LISTENER_TARGET.VENTS,
			EVENT_LISTENER_TYPE.CLICK,
			this.#handleButtonChange
		);
	}
	#handleButtonChange = (btn) => {
		const { buttonName, buttonValue } = btn.dataset;
		if (buttonName === CONTROLS.BUTTON_DATASET.SHIP_CAPACITORS) {
			this.#changeCapacitorValue(buttonValue);
		}
		if (buttonName === CONTROLS.BUTTON_DATASET.SHIP_VENTS) {
			this.#changeVentsValue(buttonValue);
		}
	};
	#changeCapacitorValue(buttonValue) {
		const userShipBuild = this.getUserShipBuild();
		const { capacitors } = userShipBuild;

		const updateValue =
			buttonValue === CONTROLS.BUTTON_ACTIONS.PLUS
				? capacitors + 1
				: capacitors - 1;

		this.setUpdateUserShipBuild({
			...userShipBuild,
			capacitors: updateValue,
		});

		this.#updateValues();
	}
	#changeVentsValue(buttonValue) {
		const userShipBuild = this.getUserShipBuild();
		const { vents } = userShipBuild;

		const updateValue =
			buttonValue === CONTROLS.BUTTON_ACTIONS.PLUS ? vents + 1 : vents - 1;

		this.setUpdateUserShipBuild({
			...userShipBuild,
			vents: updateValue,
		});

		this.#updateValues();
	}

	// #changeValue = (btn, controllerType) => {
	// 	const { buttonValue } = btn.dataset;
	// 	const userShipBuild = this.getUserShipBuild();
	// 	// Should be only, just in case

	// 	if (!Object.values(CONTROLS.BUTTON_ACTIONS).includes(buttonValue)) return;

	// 	// Trying ot use ENUMS
	// 	const increment = buttonValue === CONTROLS.BUTTON_ACTIONS.PLUS ? 1 : -1;

	// 	if (controllerType === CONTROLS.TYPE.CAPACITORS) {
	// 		const newShipBuild = this.#updateCapacitor(userShipBuild, increment);
	// 		this.setUpdateUserShipBuild(newShipBuild);
	// 		this.capacitorHandler();
	// 	}

	// 	if (controllerType === CONTROLS.TYPE.VENTS) {
	// 		const newShipBuild = this.#updateVents(userShipBuild, increment);
	// 		this.setUpdateUserShipBuild(newShipBuild);
	// 		this.ventsHandler#ventsHandler();
	// 	}
	// };
	// #updateCapacitor(currentState, increment) {
	// 	// Base Flux is default flux for a ship
	// 	// currentCapacitors are current number of capacitors on a ship between 0 and max capacitors
	// 	// fluxCapacity per shit is value based on shipSize (Capital ship === 200)
	// 	const updatedState = this.#updateSystemValue(
	// 		currentState,
	// 		increment,
	// 		SHIP_SYSTEMS.CAPACITORS
	// 	);

	// 	return this.#updateDeriveValue(updatedState, SHIP_SYSTEMS.FLUXCAP);
	// }
	// // Vents
	// handleVentChange = (btn) => {
	// 	this.#changeValue(btn, CONTROLS.TYPE.VENTS);
	// };
	// #updateVents(currentState, increment) {
	// 	const updatedState = this.#updateSystemValue(
	// 		currentState,
	// 		increment,
	// 		SHIP_SYSTEMS.VENTS
	// 	);

	// 	return this.#updateDeriveValue(updatedState, SHIP_SYSTEMS.FLUX_DISSIPATION);
	// }

	// #updateSystemValue(state, increment, system) {
	// 	const newValue = state[system.CURRENT] + increment;

	// 	// defense from overflow
	// 	if (newValue < 0 || newValue > state[system.MAX]) {
	// 		return state;
	// 	}

	// 	return {
	// 		...state,
	// 		[system.CURRENT]: newValue,
	// 	};
	// }
	// // Increase in number of capacitors increase flux capacity.
	// #updateDeriveValue(state, target) {
	// 	// a hack, but it works
	// 	const _baseState = this._getBaseShipBuild();
	// 	const userState = this.getUserShipBuild();

	// 	const test = {
	// 		[target.CAPACITY]:
	// 			userState[target.CAPACITY] +
	// 			state[target.SELECTOR] * state[target.FLUX_PER_VALUE],
	// 	};
	// 	console.log(test);
	// 	return {
	// 		...state,
	// 		[target.CAPACITY]:
	// 			_baseState[target.CAPACITY] +
	// 			state[target.SELECTOR] * state[target.FLUX_PER_VALUE],
	// 	};
}
