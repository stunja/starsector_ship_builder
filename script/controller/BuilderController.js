import builderView from "../allViews/builderView";
import * as model from "../model.js";

class BuilderController {
	init() {
		this.#containerRender();
	}
	#containerRender() {
		builderView.renderComponent(builderView.render(model.state));
	}
}
export default new BuilderController();
