// View
import View from "../view.js";
// Helper
import DATASET from "../../helper/ui/datasets.js";
import URL from "../../helper/url.js";
import CLASS_NAMES from "../../helper/ui/class_names.js";
import { GENERIC_STRING } from "../../helper/ui/ui_main.js";
import HullModHelper from "../../components/Hullmods/HullModHelper.js";

const BUTTON_TYPE = {
	MINUS: "-",
};
class InstalledHullMods extends View {
	_localParent = `.${CLASS_NAMES.installedHullMods}`;
	#installedHullMods;
	#hullSize;

	generateMarkup() {
		this.#processData(this._data);

		const markup = this.#addInstalledHullMod();
		return markup;
	}

	#processData([{ hullMods }, hullSize]) {
		this.#installedHullMods = hullMods.installedHullMods;
		this.#hullSize = hullSize;
	}

	#addInstalledHullMod() {
		if (!this.#installedHullMods || this.#installedHullMods?.length < 1)
			return GENERIC_STRING.EMPTY && console.warn("Too Few hullMods to Render");

		const markup = this.#installedHullMods
			.map(
				(currentHullMod) =>
					`<li class="${CLASS_NAMES.flexFlexEndGap} ${CLASS_NAMES.hullMod}">
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
				<p class="${CLASS_NAMES.hullModCost}">
					[${HullModHelper.normalizedHullSize(currentHullMod, this.#hullSize)}]
				</p>`;

	#buttonMarkup = (currentHullMod) =>
		`<button class="${CLASS_NAMES.button} ${CLASS_NAMES.buttonCircle} ${CLASS_NAMES.removeInstalledHullModButton}"
			${DATASET.dataHullModId}="${currentHullMod.id}"
		>
			${GENERIC_STRING.MINUS}
		</button>`;

	#imageMarkup = (currentHullMod) =>
		`<img src="./${URL.DATA}/${currentHullMod.sprite}" alt="${currentHullMod.short}" />`;
}
export default new InstalledHullMods();
