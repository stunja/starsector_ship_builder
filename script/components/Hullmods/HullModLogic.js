// ViewModel
import ViewModel from "../../ViewModel";

// frontshield
class HullModLogic extends ViewModel {
	controller(userShipBuild) {
		return this.#installedHullModLogic(userShipBuild);
	}
	#buildInLogic(userShipBuild) {
		const { builtInMods } = userShipBuild.hullMods;
	}
}
export default new HullModLogic();
