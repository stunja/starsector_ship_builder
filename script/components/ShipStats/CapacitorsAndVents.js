// View Model
import ViewModel from "../../ViewModel";

// Views
import CapacitorsView from "../../allViews/Stats/CapacitorsView";
import OrdinancePointsView from "../../allViews/Stats/OrdinancePointsView";
import ShieldOrPhaseView from "../../allViews/Stats/ShieldOrPhaseView";

import VentsView from "../../allViews/Stats/VentsView";
import classNames from "../../helper/DomClassNames";

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
	#userShipBuild;
	#currentFluxCapacity;
	#currentFluxDissipation;

	constructor(model) {
		super(model);
		this.#userShipBuild = this.getUserShipBuild();
	}
	update() {
		this.#processData();
		this.#capacitorHandler();

		this.#ventsHandler();
		this.#updateValues();
	}
	#processData() {
		this.#currentFluxCapacity = this.#userShipBuild.fluxCapacity;
		this.#currentFluxDissipation = this.#userShipBuild.fluxDissipation;
	}
	#updateValues() {
		this.#userShipBuild = this.getUserShipBuild();

		const {
			fluxCapacity,
			fluxDissipation,
			fluxCapacityPerSingleActiveCapacitor,
			capacitors,
			capacitorsOrdinanceCost,
			ordinancePoints,
			vents,
			fluxDissipationPerSingleActiveVent,
		} = this.#userShipBuild;

		const updateFluxCapacity =
			this.#currentFluxCapacity +
			fluxCapacityPerSingleActiveCapacitor * capacitors;

		const updateFluxDissipation =
			this.#currentFluxDissipation + fluxDissipationPerSingleActiveVent * vents;

		const updateOrdinanceCost = capacitors * capacitorsOrdinanceCost;

		this.setUpdateUserShipBuild({
			...this.#userShipBuild,
			ordinancePoints: updateOrdinanceCost,
			fluxCapacity: updateFluxCapacity,
			fluxDissipation: updateFluxDissipation,
		});

		this.#userShipBuild = this.getUserShipBuild();

		OrdinancePointsView.render(this.#userShipBuild);
		ShieldOrPhaseView.render(this.#userShipBuild);
		this.#capacitorHandler();
		this.#ventsHandler();
	}
	#capacitorHandler() {
		CapacitorsView.render(this.#userShipBuild);

		CapacitorsView.addClickHandler(
			EVENT_LISTENER_TARGET.CAPACITOR,
			EVENT_LISTENER_TYPE.CLICK,
			this.#handleButtonChange
		);
	}
	#ventsHandler() {
		VentsView.render(this.#userShipBuild);

		VentsView.addClickHandler(
			EVENT_LISTENER_TARGET.VENTS,
			EVENT_LISTENER_TYPE.CLICK,
			this.#handleButtonChange
		);
	}
	#handleButtonChange = (btn) => {
		const { buttonName, buttonValue } = btn.dataset;

		if (buttonName === CONTROLS.BUTTON_DATASET.SHIP_CAPACITORS)
			this.#changeCapacitorValue(buttonValue);

		if (buttonName === CONTROLS.BUTTON_DATASET.SHIP_VENTS)
			this.#changeVentsValue(buttonValue);
	};
	#changeCapacitorValue(buttonValue) {
		const { capacitors, maxCapacitors } = this.#userShipBuild;

		this.setUpdateUserShipBuild({
			...this.#userShipBuild,
			capacitors: this.#buttonControls(buttonValue, capacitors, maxCapacitors),
		});

		this.#updateValues();
	}

	#changeVentsValue(buttonValue) {
		const { vents, maxVents } = this.#userShipBuild;

		this.setUpdateUserShipBuild({
			...this.#userShipBuild,
			vents: this.#buttonControls(buttonValue, vents, maxVents),
		});

		this.#updateValues();
	}

	#buttonControls = (buttonValue, target, maxTarget) => {
		if (buttonValue === CONTROLS.BUTTON_ACTIONS.PLUS)
			return target >= maxTarget ? target : target + 1;

		if (buttonValue === CONTROLS.BUTTON_ACTIONS.MINUS)
			return target <= 0 ? target : target - 1;
	};
}
