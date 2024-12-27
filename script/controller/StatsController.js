// import builderRightView from "../allViews/builderRightView";
import builderView from "../allViews/builderView.js";
import OrdinancePointsView from "../components/Stats/OrdinancePointsView.js";
import SpeedArmorHullView from "../components/Stats/SpeedArmorHullView.js";
import CapacitorsView from "../components/Stats/CapacitorsView.js";
import EventHandlers from "../eventHandlers/EventHandlers";
import CapacitorsAndVentsController from "./CapacitorsAndVentsController.js";
import VentsView from "../components/Stats/VentsView.js";

import * as model from "../model.js";
// import classNames from "../helper/DomClassNames.js";

class StatsContoller {
	init() {
		this.#ordinancePoints();
		this.#speedArmorHull();
		this.capacitorsAndFluxCapacity();
		this.ventsAndFluxDissipation();
		// this.#weaponFlux();
		// this.#shipShieldRenderBasedOnShipType();
		// capacitorController.assignFluxCapacity();
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
	#shipShieldRenderBasedOnShipType() {
		const { shipType } = model.state.currentShipBuild;
		if (shipType === "phaseShip") {
			builderRightView.renderComponent(builderRightView.phaseDataRender());
		} else {
			builderRightView.renderComponent(builderRightView.shieldDataRender());
		}
	}

	#weaponFlux() {
		builderRightView.renderComponent(builderRightView.weaponFluxRender());
	}
	// ordinancePointsController = {
	// 	currentOrdinancePointsTextClass:
	// 		builderRightView.ordinancePointsRenderTextClass,
	// 	updateCurrentOrdinancePoints(value) {
	// 		model.state.currentShipBuild.currentOrdinancePoints += value;
	// 		builderRightView.renderComponent(
	// 			builderRightView.ordinancePointsRender()
	// 		);
	// 	},
	// };
}
export default new StatsContoller();
