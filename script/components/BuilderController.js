// Views
import BuilderView from "../allViews/BuilderView.js";
// ViewModels
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
	#search;
	#shipStats;
	#shipInfo;
	#hullModController;
	#additionalInfo;
	#fighters;
	#shipArea;
	#builderButtons;

	constructor(model) {
		super(model);

		this.#search = new Search(model);
		this.#shipStats = new ShipStats(model);
		this.#shipInfo = new ShipInfo(model);
		this.#hullModController = new HullModController(model);
		this.#additionalInfo = new AdditionalInfo(model);
		this.#fighters = new FighterSlots(model);
		this.#shipArea = new ShipArea(model);
		this.#builderButtons = new BuilderButtons(model);

		this.init();
	}
	init() {
		// Builder
		this.#builderRender();
		this.#search.update();
		// Right View
		this.#shipStats.update();
		// HullMods
		this.#hullModController.update();
		// Left View
		this.#shipInfo.update();
		this.#fighters.update();
		this.#builderButtons.update();
		// Center View
		this.#additionalInfo.update();
		// Main Work Area
		this.#shipArea.update();

		// searchView.addSearchHandler(findCreateDisplayCurrentShip);
	}
	#builderRender() {
		BuilderView.render(this.getState());
	}
}
