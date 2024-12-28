import ShipInfoContainerView from "../components/Containers/ShipInfoContainerView";
import * as model from "../model";
import builderView from "../allViews/builderView";

class ShipInfoContainer {
	init() {
		this.#containerRender();
	}
	#containerRender() {
		builderView.renderComponent(ShipInfoContainerView.render(model.state));
	}
}
export default new ShipInfoContainer();
