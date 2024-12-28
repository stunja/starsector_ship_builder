import builderView from "../allViews/builderView.js";
import * as model from "../model.js";
import FighterContainerView from "../components/Fighters/FighterContainerView.js";

class FighterController {
	init() {
		this.#containerRender();
	}
	#containerRender() {
		builderView.renderComponent(FighterContainerView.render(model.state));
	}
}
export default new FighterController();
