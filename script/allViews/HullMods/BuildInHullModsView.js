import classNames from "../../helper/DomClassNames";
import URL from "../../helper/url.js";
// View
import View from "../view.js";

class BuildInHullModsView extends View {
	_localParent = `.${classNames.buildInHullmods}`;

	#buildInHullMods;

	generateMarkup() {
		this.#processData(this._data);

		const markup = this.#buildInMarkUp();
		return markup;
	}
	#processData(data) {
		this.#buildInHullMods = data;
	}

	#buildInMarkUp() {
		if (this.#buildInHullMods.length < 1)
			return "" || console.warn("Too Few hullMods to Render");

		const markup = this.#buildInHullMods
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
