import ViewModel from "../../ViewModel.js";

import OrdinancePointsView from "../../allViews/Stats/OrdinancePointsView.js";
import SpeedArmorHullView from "../../allViews/Stats/SpeedArmorHullView.js";
import WeaponFluxView from "../../allViews/Stats/WeaponFluxView.js";
import ShieldOrPhaseView from "../../allViews/Stats/ShieldOrPhaseView.js";
import StatsContainerView from "../../allViews/Stats/StatsContainerView.js";
import CapacitorsAndVents from "./CapacitorsAndVents.js";

export default class ShipStats extends ViewModel {
	#getState;
	#userShipBuild;
	constructor(model) {
		super(model);

		this.#getState = this.getState();
		this.#userShipBuild = this.getUserShipBuild();
	}
	update() {
		this.#render();
	}
	#render() {
		StatsContainerView.render(this.#getState);

		OrdinancePointsView.render(this.#userShipBuild);

		SpeedArmorHullView.render(this.#userShipBuild);

		new CapacitorsAndVents(this.#getState).update();

		ShieldOrPhaseView.render(this.#userShipBuild);

		WeaponFluxView.render(this.#userShipBuild);
	}
}
