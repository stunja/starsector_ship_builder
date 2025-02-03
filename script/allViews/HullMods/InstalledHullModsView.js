import DataSet from "../../helper/DataSet.js";

import { calculateHullModCost } from "../../helper/helperFunction.js";

import classNames from "../../helper/DomClassNames.js";
import URL from "../../helper/url.js";
import View from "../view.js";
// Helper
import { GENERIC_STRING } from "../../helper/MagicStrings.js";

const BUTTON_TYPE = {
	MINUS: "-",
};
class InstalledHullMods extends View {
	_localParent = `.${classNames.installedHullMods}`;
	#installedHullMods;

	generateMarkup() {
		this.#processData(this._data);

		const markup = this.#addInstalledHullMod();
		return markup;
	}
	#processData(data) {
		this.#installedHullMods = data;
	}

	#addInstalledHullMod() {
		if (!this.#installedHullMods || this.#installedHullMods?.length < 1)
			return GENERIC_STRING.EMPTY && console.warn("Too Few hullMods to Render");

		const markup = this.#installedHullMods
			.map(
				(currentHullMod) =>
					`<li class="${classNames.flexFlexEndGap} ${classNames.hullMod}">
						<h5>${currentHullMod.name}</h5>
						<button class="${classNames.button} ${classNames.buttonCircle} ${classNames.removeInstalledHullModButton}"
							${DataSet.dataHullModId}="${currentHullMod.id}"
						>
							${BUTTON_TYPE.MINUS}
						</button>
						<img src="./${URL.DATA}/${currentHullMod.sprite}" alt="${currentHullMod.short}" />
					</li>`
			)
			.join("");

		return markup;
	}
}
export default new InstalledHullMods();
