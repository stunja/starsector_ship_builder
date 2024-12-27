import * as model from "../model.js";
import builderView from "../allViews/builderView.js";
import HullModView from "../components/HullMods/HullModView.js";
import BuildInHullMods from "../components/HullMods/BuildInHullModsView.js";
import AddNewHullModView from "../components/HullMods/AddNewHullModView.js";

class HullModController {
	init() {
		this.#hullModBase();
		this.#buildInHullMods();
		this.#addNewHullMod();
	}
	#hullModBase() {
		builderView.renderComponent(HullModView.render(model.state));
	}
	#buildInHullMods() {
		builderView.renderComponent(BuildInHullMods.render(model.state));
	}
	#addNewHullMod() {
		const { activeHullMods } = model.state.currentShipBuild.hullMods;
		if (!activeHullMods) return "";

		builderView.renderComponent(AddNewHullModView.render(model.state));
	}
}
export default new HullModController();
