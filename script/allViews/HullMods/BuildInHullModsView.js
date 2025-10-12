// Helper
import CLASS_NAMES from "../../helper/ui/class_names.js";
import URL from "../../helper/url.js";
import { GENERIC_STRING } from "../../helper/ui/ui_main.js";
// View
import View from "../view.js";

class BuildInHullModsView extends View {
	_localParent = `.${CLASS_NAMES.buildInHullmods}`;

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
			return GENERIC_STRING.EMPTY && console.warn("Too Few hullMods to Render");

		const markup = this.#buildInHullMods
			.map(
				(currentHullMod) =>
					`<li class="${CLASS_NAMES.flexFlexEndGap} ${CLASS_NAMES.hullMod}">
						<h5>${currentHullMod.name}</h5>
						<img src="./${URL.DATA}/${currentHullMod.sprite}"
						alt="${currentHullMod.short}" />
					</li>`
			)
			.join(GENERIC_STRING.EMPTY);

		return `<div class="${CLASS_NAMES.buildInHullModsContainer}">${markup}</div>`;
	}
}
export default new BuildInHullModsView();
