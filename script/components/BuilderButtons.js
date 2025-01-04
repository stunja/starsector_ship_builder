import ViewModel from "../ViewModel";
import BuilderButtonsView from "../allViews/BuilderButtonsView";
import classNames from "../helper/DomClassNames";

const EVENT_LISTENER_TARGET = {
	BUILDER_BUTTON: `.${classNames.builderButton}`,
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
			this.test
		);
	}
	test(btn) {
		console.log(btn);
	}
}
