// import builderRightView from "../allViews/builderRightView";
import builderView from "../allViews/builderView.js";
import OrdinancePointsView from "../components/Stats/OrdinancePointsView.js";
import SpeedArmorHullView from "../components/Stats/SpeedArmorHullView.js";
import CapacitorsView from "../components/Stats/CapacitorsView.js";
import EventHandlers from "../eventHandlers/EventHandlers";
import CapacitorsAndVentsController from "./CapacitorsAndVentsController.js";
import VentsView from "../components/Stats/VentsView.js";
import WeaponFluxView from "../components/Stats/WeaponFluxView.js";
import ShieldOrPhaseView from "../components/Stats/ShieldOrPhaseView.js";

import * as model from "../model.js";

class StatsContoller {
	init() {
		this.#ordinancePoints();
		this.#speedArmorHull();
		this.capacitorsAndFluxCapacity();
		this.ventsAndFluxDissipation();
		this.#weaponFlux();
		this.#shieldOrPhase();
	}
	#ordinancePoints() {
		builderView.renderComponent(OrdinancePointsView.render(model.state));
	}
	#speedArmorHull() {
		builderView.renderComponent(SpeedArmorHullView.render(model.state));
	}
	capacitorsAndFluxCapacity() {
		builderView.renderComponent(CapacitorsView.render(model.state));

		EventHandlers.removeEventListener(
			CapacitorsAndVentsController.handleCapacitorChange
		);
		EventHandlers.addEventListenerReturnDataSet(
			EventHandlers.capacitorsHandler(
				CapacitorsAndVentsController.handleCapacitorChange
			)
		);
	}
	ventsAndFluxDissipation() {
		builderView.renderComponent(VentsView.render(model.state));

		EventHandlers.removeEventListener(
			CapacitorsAndVentsController.handleVentChange
		);
		EventHandlers.addEventListenerReturnDataSet(
			EventHandlers.ventsHandler(CapacitorsAndVentsController.handleVentChange)
		);
	}
	#shieldOrPhase() {
		builderView.renderComponent(ShieldOrPhaseView.render(model.state));
	}

	#weaponFlux() {
		builderView.renderComponent(WeaponFluxView.render());
	}
}
export default new StatsContoller();
