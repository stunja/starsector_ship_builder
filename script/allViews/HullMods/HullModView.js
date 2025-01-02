import classNames from "../../helper/DomClassNames";
import DataSet from "../../helper/DataSet";
import View from "../view";

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
	_localParent = `.${classNames.hullMods}`;

	generateMarkup() {
		const markup = `${this.#hullModMarkUp()}`;

		return markup;
	}

	#hullModMarkUp() {
		return `
	                <h3 class="${classNames.hullMods__Header}">${TITLES.HEADER}</h3>
	                <ul class="${classNames.hullMods__Container}">
	                  <div class="${classNames.buildInHullmods}"></div>
	                  <div class="${classNames.addedHullmods}"></div>
	                </ul>
	                <ul class="${classNames.flexFlexEndGap} ${classNames.hullMods__Buttons}">
	                  <li>
	                    <button class="${classNames.button} ${classNames.hullMods__ButtonOpen}" 
                        ${DataSet.dataHullModButtonType}="${BUTTON__TYPE.OPEN}">
                            ${TITLES.BUTTON__OPEN}
                        </button>
	                  </li>
	                  <li>
	                    <button class="${classNames.button} ${classNames.hullMods__ButtonSmods}" 
                        ${DataSet.dataHullModButtonType}="${BUTTON__TYPE.SMODS}">
                            ${TITLES.BUTTON__SMODS}
                        </button>
	                  </li>
	                </ul>
	  `;
	}
}
export default new HullModView();
