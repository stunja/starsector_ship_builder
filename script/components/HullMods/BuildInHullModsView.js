import classNames from "../../helper/DomClassNames";
import * as URL from "../../helper/url.js";

class BuildInHullMods {
	render(state) {
		const localParent = `.${classNames.buildInHullmods}`;

		const markup = `${this.#buildInMarkUp(state.currentShipBuild)}`;

		return [markup, localParent];
	}
	#buildInMarkUp(state) {
		const hullMods = state.hullMods;
		if (!hullMods.buildInHullMods) return "";

		const markup = hullMods.buildInHullMods
			.map(
				(currentHullMod) => `
	              <li class="${classNames.flexFlexEndGap} ${classNames.buildInHullmods__HullMod}">
	                <h5>${currentHullMod.name}</h5>
	                <img src="./${URL.DATA}/${currentHullMod.sprite_}"
	                alt="${currentHullMod.short}" />
	              </li>`
			)
			.join("");

		return markup;
	}
}
export default new BuildInHullMods();
