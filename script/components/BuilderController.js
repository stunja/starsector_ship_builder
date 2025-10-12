// Views
import BuilderView from "../allViews/BuilderView.js";
// Components
import ViewModel from "../ViewModel.js";
import Search from "./Search.js";
import ShipStats from "./ShipStats/ShipStats.js";
import ShipInfo from "./ShipInfo.js";
import HullModController from "./Hullmods/HullModController.js";
import AdditionalInfo from "./AdditionalInfo.js";
import FighterSlots from "./Fighter/FighterSlots.js";
import ShipArea from "./ShipArea/ShipArea.js";
import BuilderButtons from "./BuilderButtons.js";

export default class BuilderController extends ViewModel {
	constructor(model) {
		super(model);

		this.init();
	}
	init() {
		const model = this.getState();
		// Builder
		BuilderView.render(model);

		new Search(model).update();
		// Right View
		new ShipStats(model).update();
		// HullMods
		new HullModController(model).update();
		// Left View
		new ShipInfo(model).update();
		new FighterSlots(model).update();
		new BuilderButtons(model).update();
		// Center View
		new AdditionalInfo(model).update();
		// Main Work Area
		new ShipArea(model).update();

		// searchView.addSearchHandler(findCreateDisplayCurrentShip);
	}
}
