import ViewModel from "../../ViewModel.js";

import OrdinancePointsView from "../../allViews/Stats/OrdinancePointsView.js";
import SpeedArmorHullView from "../../allViews/Stats/SpeedArmorHullView.js";
import WeaponFluxView from "../../allViews/Stats/WeaponFluxView.js";
import ShieldOrPhaseView from "../../allViews/Stats/ShieldOrPhaseView.js";
import StatsContainerView from "../../allViews/Stats/StatsContainerView.js";
import CapacitorsAndVents from "./CapacitorsAndVents.js";

export default class ShipStats extends ViewModel {
	#capacitorsAndVents;
	constructor(model) {
		super(model);

		this.#capacitorsAndVents = new CapacitorsAndVents(model);
	}
	update() {
		StatsContainerView.render(this.getState());
		OrdinancePointsView.render(this.getUserShipBuild());
		SpeedArmorHullView.render(this.getUserShipBuild());
		this.#capacitorsAndVents.update();
		ShieldOrPhaseView.render(this.getUserShipBuild());
		WeaponFluxView.render(this.getUserShipBuild());
	}
}
