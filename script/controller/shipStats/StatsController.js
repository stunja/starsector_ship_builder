import builderView from "../../allViews/builderView.js";
// import ViewModel from "../../viewModel.js";

import OrdinancePointsView from "../../components/Stats/OrdinancePointsView.js";
import SpeedArmorHullView from "../../components/Stats/SpeedArmorHullView.js";
import CapacitorsView from "../../components/Stats/CapacitorsView.js";
import EventHandlers from "../../eventHandlers/EventHandlers";
import CapacitorsAndVentsController from "./CapacitorsAndVentsController.js";
import VentsView from "../../components/Stats/VentsView.js";
import WeaponFluxView from "../../components/Stats/WeaponFluxView.js";
import ShieldOrPhaseView from "../../components/Stats/ShieldOrPhaseView.js";
import StatsContainerView from "../../components/Stats/StatsContainerView.js";

// import * as model from "../../model.js";

export default class StatsContoller {
	init() {
		console.log("test");
		// this.#containerRender();
		// this.#ordinancePoints();
		// this.#speedArmorHull();
		// this.capacitorsAndFluxCapacity();
		// this.ventsAndFluxDissipation();
		// this.#weaponFlux();
		// this.#shieldOrPhase();
	}
	#containerRender() {
		builderView.renderComponent(StatsContainerView.render(model.state));
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
// export default StatsContoller;
