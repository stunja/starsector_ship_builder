// View
import View from "../view";
// Helper
import CLASS_NAMES from "../../helper/ui/class_names";
import DATASET from "../../helper/ui/datasets";

const BUTTON__TYPE = {
	OPEN: "open",
	SMODS: "smods",
};
const TITLES = {
	HEADER: "Hull features & mods",
	BUTTON__OPEN: "Open HullMod Menu",
	BUTTON__SMODS: "S-Mods",
};
class HullModView extends View {
	_localParent = `.${CLASS_NAMES.hullMods}`;

	generateMarkup() {
		const markup = this.#hullModMarkUp();
		return markup;
	}

	#hullModMarkUp() {
		const DATASETButtonType = (type) =>
			`${DATASET.dataHullModButtonType}="${type}"`;

		// prettier-ignore
		return `
	                <h3 class="${CLASS_NAMES.hullMods__header}">${TITLES.HEADER}</h3>
	                <ul class="${CLASS_NAMES.hullMods__container}">
	                  <div class="${CLASS_NAMES.buildInHullmods}"></div>
	                  <div class="${CLASS_NAMES.installedHullMods}"></div>
	                </ul>
	                <ul class="${CLASS_NAMES.flexFlexEndGap} ${CLASS_NAMES.hullMods__buttons}">
	                  <li>
	                    <button class="${CLASS_NAMES.button} ${CLASS_NAMES.hullMods__button}"
                        	${DATASETButtonType(BUTTON__TYPE.OPEN)}
						>
                            ${TITLES.BUTTON__OPEN}
                        </button>
	                  </li>
	                  <li>
	                    <button class="${CLASS_NAMES.button} ${CLASS_NAMES.hullMods__button}" ${DATASET.dataHullModButtonType}="${BUTTON__TYPE.SMODS}">
                            ${TITLES.BUTTON__SMODS}
                        </button>
	                  </li>
	                </ul>
	  `;
	}
}
export default new HullModView();
