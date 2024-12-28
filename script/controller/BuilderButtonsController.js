import builderView from "../allViews/builderView.js";
import BuilderButtonsContainerView from "../components/Containers/BuilderButtonsContainerView.js";
import * as model from "../model.js";

class BuilderButtonsController {
	init() {
		this.#containerRender();
	}
	#containerRender() {
		builderView.renderComponent(
			BuilderButtonsContainerView.render(model.state)
		);
	}
}
export default new BuilderButtonsController();
