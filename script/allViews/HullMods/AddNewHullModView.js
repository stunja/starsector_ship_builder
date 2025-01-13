import DataSet from "../../helper/DataSet.js";
import classNames from "../../helper/DomClassNames";
import URL from "../../helper/url";

import { calculateHullModCost } from "../../helper/helperFunction.js";

const BUTTON__TYPE = {
	MINUS: "-",
};
class AddNewHullModView {
	render(state) {
		const localParent = `.${classNames.addedHullmods}`;

		const markup = `${this.#addHullModMarkup(state.currentShipBuild)}`;

		return [markup, localParent];
	}
	#addHullModMarkup(currentShipBuild) {
		return currentShipBuild.hullMods.activeHullMods.map(
			(hullmod) => `
	              <li class="${classNames.flexFlexEndGap} 
                    ${classNames.addedHullMods__hullmod}"
                    >
	                <h5>${hullmod.name}</h5>
	                <p>(${calculateHullModCost(hullmod)})</p>
	                <button class="${classNames.button} 
                        ${classNames.buttonCircle} 
                        ${classNames.addedHullMods__RemoveButton}" 
                        ${DataSet.dataHullModId}="${hullmod.id}">
                        ${BUTTON__TYPE.MINUS}
                    </button>
	                <img src="./${URL.DATA}/${hullmod.sprite_}"
	                alt="${hullmod.short}" />
	              </li>`
		);
	}
}
export default new AddNewHullModView();
