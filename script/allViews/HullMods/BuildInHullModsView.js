import classNames from "../../helper/DomClassNames";
import URL from "../../helper/url.js";
import View from "../view.js";

class BuildInHullModsView extends View {
	_localParent = `.${classNames.buildInHullmods}`;

	generateMarkup() {
		const data = this._data;

		const markup = `${this.#buildInMarkUp(data)}`;

		return markup;
	}
	#findHullModObject = (hullModsArray, targetHullModId) =>
		hullModsArray.find((hullmod) => hullmod.id === targetHullModId);

	#filterHullMods = (buildInHullMods, hullModsArray) => {
		return buildInHullMods
			.map((buildInHullMod) =>
				this.#findHullModObject(hullModsArray, buildInHullMod)
			)
			.filter((item) => item !== undefined);
	};
	#buildInMarkUp([userShipBuild, usableHullMods]) {
		const buildInHullMods = userShipBuild.hullMods.builtInMods;
		if (!buildInHullMods) return "";

		const newArray = this.#filterHullMods(buildInHullMods, usableHullMods);
		if (newArray.length < 1) return console.warn("Too Few hullMods to Render");

		const markup = newArray
			.map(
				(currentHullMod) =>
					`<li class="${classNames.flexFlexEndGap} ${classNames.buildInHullmods__HullMod}">
						<h5>${currentHullMod.name}</h5>
						<img src="./${URL.DATA}/${currentHullMod.sprite}"
						alt="${currentHullMod.short}" />
					</li>`
			)
			.join("");

		return markup;
	}
}
export default new BuildInHullModsView();
