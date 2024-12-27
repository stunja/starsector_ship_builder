// import builderRightView from "../allViews/builderRightView";
import builderView from "../allViews/builderView.js";
import OrdinancePointsView from "../components/Stats/OrdinancePointsView.js";
import SpeedArmorHullView from "../components/Stats/SpeedArmorHullView.js";
import CapacitorsView from "../components/Stats/CapacitorsView.js";
import EventHandlers from "../eventHandlers/EventHandlers";
import CapacitorsController from "./CapacitorsController.js";
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

		EventHandlers.removeEventListener(CapacitorsController.changeValue);
		EventHandlers.addEventListenerReturnDataSet(
			EventHandlers.addCapacitorsHandler(CapacitorsController.changeValue)
		);
	}
	ventsAndFluxDissipation() {
		builderView.renderComponent(VentsView.render(model.state));

		// EventHandlers.removeEventListener(ventController.changeCurrentActiveVents);
		// EventHandlers.addEventListenerReturnDataSet(
		// 	EventHandlers.addVentsHandler(ventController.changeCurrentActiveVents)
		// );
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

	// ventController = {
	// 	changeCurrentActiveVents(btn) {
	// 		const { buttonValue } = btn.dataset;

	// 		const { activeVents, maxVents } = model.state.currentShipBuild;
	// 		if (buttonValue < 0 && activeVents > 0)
	// 			ventController.changeCurrentVents(-1);
	// 		if (buttonValue > 0 && activeVents < maxVents)
	// 			ventController.changeCurrentVents(+1);
	// 	},
	// 	changeCurrentVents(value) {
	// 		const { currentShipBuild } = model.state;

	// 		currentShipBuild.activeVents += value;

	// 		ordinancePointsController.updateCurrentOrdinancePoints(
	// 			currentShipBuild.activeVentsOrdinanceCost + value - 1
	// 		);
	// 		ventController.increaseDecreaseCurrentFluxDissipation(value);
	// 		ventsRender();
	// 	},

	// 	increaseDecreaseCurrentFluxDissipation(value = 0) {
	// 		const {
	// 			currentFluxDissipation,
	// 			currentFluxDissipationPerSingleActiveVent,
	// 		} = model.state.currentShipBuild;

	// 		if (value === -1) {
	// 			model.state.currentShipBuild.currentFluxDissipation =
	// 				currentFluxDissipation - currentFluxDissipationPerSingleActiveVent;
	// 		}
	// 		if (value === 1) {
	// 			model.state.currentShipBuild.currentFluxDissipation =
	// 				currentFluxDissipation + currentFluxDissipationPerSingleActiveVent;
	// 		}
	// 	},
	// 	ventDissipationCalcBasedOnActiveVents() {
	// 		// used for resetData function
	// 		const {
	// 			_baseFluxDissipation,
	// 			activeVents,
	// 			currentFluxDissipationPerSingleActiveVent,
	// 		} = model.state.currentShipBuild;

	// 		model.state.currentShipBuild.currentFluxDissipation =
	// 			_baseFluxDissipation +
	// 			activeVents * currentFluxDissipationPerSingleActiveVent;
	// 	},
	// };
}
export default new StatsContoller();
