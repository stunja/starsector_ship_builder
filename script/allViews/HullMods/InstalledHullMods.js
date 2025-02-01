import DataSet from "../../helper/DataSet.js";

import { calculateHullModCost } from "../../helper/helperFunction.js";

import classNames from "../../helper/DomClassNames.js";
import URL from "../../helper/url.js";
import View from "../view.js";

const BUTTON__TYPE = {
	MINUS: "-",
};
class InstalledHullMods extends View {
	_localParent = `.${classNames.installedHullMods}`;

	generateMarkup() {
		// const localParent = `.${classNames.addedHullmods}`;

		// const markup = `${this.#addHullModMarkup(state.currentShipBuild)}`;
		const markup = "";
		return markup;
	}
	// #addHullModMarkup(currentShipBuild) {
	// 	return currentShipBuild.hullMods.activeHullMods.map(
	// 		(hullmod) => `
	//               <li class="${classNames.flexFlexEndGap}
	//                 ${classNames.addedHullMods__hullmod}"
	//                 >
	//                 <h5>${hullmod.name}</h5>
	//                 <p>(${calculateHullModCost(hullmod)})</p>
	//                 <button class="${classNames.button}
	//                     ${classNames.buttonCircle}
	//                     ${classNames.addedHullMods__RemoveButton}"
	//                     ${DataSet.dataHullModId}="${hullmod.id}">
	//                     ${BUTTON__TYPE.MINUS}
	//                 </button>
	//                 <img src="./${URL.DATA}/${hullmod.sprite_}"
	//                 alt="${hullmod.short}" />
	//               </li>`
	// 	);
	// }
}
export default new InstalledHullMods();
