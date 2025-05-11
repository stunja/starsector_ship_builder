// View
import BuilderButtonsView from "../allViews/BuilderButtonsView";
// ViewModel
import ViewModel from "../ViewModel";
// Helper
import classNames from "../helper/DomClassNames";
import UpdateUserShipBuild from "../helper/UpdateUserShipBuild";
import BuilderController from "./BuilderController";

const EVENT_LISTENER_TARGET = {
	BUILDER_BUTTON: `.${classNames.builderButton}`,
};

const BUTTON_TYPE = {
	STRIP: "strip",
	SAVE: "save",
};
export default class BuilderButtons extends ViewModel {
	constructor(model) {
		super(model);
	}
	update() {
		this.#containerRender();
	}
	#containerRender() {
		BuilderButtonsView.render(this.getUserShipBuild());
		BuilderButtonsView.addClickHandler(
			EVENT_LISTENER_TARGET.BUILDER_BUTTON,
			"click",
			this.#buttonLogic
		);
	}
	#buttonLogic = (btn) => {
		// keep arrow function
		const { builderButtonType } = btn.dataset;
		const model = this.getState();

		if (builderButtonType === BUTTON_TYPE.STRIP) {
			new UpdateUserShipBuild(model).clearUserShipBuild();
			new BuilderController(model).init();
		}

		if (builderButtonType === BUTTON_TYPE.SAVE) {
			console.log("save");
		}
	};
}
