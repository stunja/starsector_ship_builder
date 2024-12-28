import builderView from "../allViews/builderView.js";
import AdditionalInfoContainerView from "../components/Containers/AdditionalInfoContainerView";
import * as model from "../model.js";

class AdditionalInfoController {
	init() {
		this.#containerRender();
	}
	#containerRender() {
		builderView.renderComponent(
			AdditionalInfoContainerView.render(model.state)
		);
	}
}
export default new AdditionalInfoController();
