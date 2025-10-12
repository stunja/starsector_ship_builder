// View Model
import ViewModel from "../../ViewModel";

// Views
import CapacitorsView from "../../allViews/Stats/CapacitorsView";
import OrdinancePointsView from "../../allViews/Stats/OrdinancePointsView";
import ShieldOrPhaseView from "../../allViews/Stats/ShieldOrPhaseView";
import VentsView from "../../allViews/Stats/VentsView";

// Helper
import UpdateUserShipBuild from "../../helper/UpdateUserShipBuild";
import CLASS_NAMES from "../../helper/ui/class_names";

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
	CAPACITOR: `.${CLASS_NAMES.shipCapacitors__Button}`,
	VENTS: `.${CLASS_NAMES.shipVents__Button}`,
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

	constructor(model) {
		super(model);

		this.update();
	}
	update() {
		this.#processData();
		this.#capacitorHandler();
		this.#ventsHandler();
	}
	#updateRender() {
		OrdinancePointsView.render(this.#userShipBuild);
		ShieldOrPhaseView.render(this.#userShipBuild);
	}
	#processData() {
		this.#userShipBuild = this.getUserShipBuild();
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

		const newCapacitorsValue = this.#buttonControls(
			buttonValue,
			capacitors,
			maxCapacitors
		);
		new UpdateUserShipBuild(this.getState()).updateCapacitors(
			newCapacitorsValue
		);

		this.#userShipBuild = this.getUserShipBuild();

		this.#updateRender();

		this.#capacitorHandler();
	}

	#changeVentsValue(buttonValue) {
		const { vents, maxVents } = this.#userShipBuild;

		const newVentsValue = this.#buttonControls(buttonValue, vents, maxVents);
		new UpdateUserShipBuild(this.getState()).updateVents(newVentsValue);

		this.#userShipBuild = this.getUserShipBuild();

		this.#updateRender();

		this.#ventsHandler();
	}

	#buttonControls = (buttonValue, target, maxTarget) => {
		if (buttonValue === CONTROLS.BUTTON_ACTIONS.PLUS)
			return target >= maxTarget ? target : target + 1;

		if (buttonValue === CONTROLS.BUTTON_ACTIONS.MINUS)
			return target <= 0 ? target : target - 1;
	};
}
