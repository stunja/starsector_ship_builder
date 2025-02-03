// View
import View from "../view.js";
// Helper
import DataSet from "../../helper/DataSet.js";
import URL from "../../helper/url.js";
import classNames from "../../helper/DomClassNames.js";
import { GENERIC_STRING } from "../../helper/MagicStrings.js";
import { normalizedHullSize } from "../../components/Hullmods/HullModHelper.js";

const BUTTON_TYPE = {
	MINUS: "-",
};
class InstalledHullMods extends View {
	_localParent = `.${classNames.installedHullMods}`;
	#installedHullMods;
	#hullSize;

	generateMarkup() {
		this.#processData(this._data);

		const markup = this.#addInstalledHullMod();
		return markup;
	}
	#processData([installedHullMods, hullSize]) {
		this.#installedHullMods = installedHullMods;
		this.#hullSize = hullSize;
	}

	#addInstalledHullMod() {
		if (!this.#installedHullMods || this.#installedHullMods?.length < 1)
			return GENERIC_STRING.EMPTY && console.warn("Too Few hullMods to Render");

		const markup = this.#installedHullMods
			.map(
				(currentHullMod) =>
					`<li class="${classNames.flexFlexEndGap} ${classNames.hullMod}">
						<h5>${currentHullMod.name}</h5>
						${this.#hullModCostMarkup(currentHullMod)}
						${this.#buttonMarkup(currentHullMod)}
						${this.#imageMarkup(currentHullMod)}
					</li>`
			)
			.join("");

		return markup;
	}
	// Markups
	#hullModCostMarkup = (currentHullMod) => `
				<p class="${classNames.hullModCost}">
					[${normalizedHullSize(currentHullMod, this.#hullSize)}]
				</p>`;

	#buttonMarkup = (currentHullMod) =>
		`<button class="${classNames.button} ${classNames.buttonCircle} ${classNames.removeInstalledHullModButton}"
			${DataSet.dataHullModId}="${currentHullMod.id}"
		>
			${BUTTON_TYPE.MINUS}
		</button>`;

	#imageMarkup = (currentHullMod) =>
		`<img src="./${URL.DATA}/${currentHullMod.sprite}" alt="${currentHullMod.short}" />`;
}
export default new InstalledHullMods();
