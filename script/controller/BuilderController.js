import builderView from "../allViews/builderView";
// import * as model from "../model.js";
import ViewModel from "../viewModel.js";

export default class BuilderController extends ViewModel {
	constructor(model) {
		super();
		this.model = model;
		this.init();
	}
	init() {
		const state = this.model.state;
		console.log(state);
		console.log("test");
		this.#containerRender();
	}
	#containerRender() {
		// builderView.renderComponent(builderView.render(model.state));
	}
}
// export default new BuilderController();
