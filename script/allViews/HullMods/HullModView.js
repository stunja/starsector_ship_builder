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
		const dataSetButtonType = (type) =>
			`${DataSet.dataHullModButtonType}="${type}"`;

		// prettier-ignore
		return `
	                <h3 class="${classNames.hullMods__header}">${TITLES.HEADER}</h3>
	                <ul class="${classNames.hullMods__container}">
	                  <div class="${classNames.buildInHullmods}"></div>
	                  <div class="${classNames.installedHullMods}"></div>
	                </ul>
	                <ul class="${classNames.flexFlexEndGap} ${classNames.hullMods__buttons}">
	                  <li>
	                    <button class="${classNames.button} ${classNames.hullMods__button}"
                        	${dataSetButtonType(BUTTON__TYPE.OPEN)}
						>
                            ${TITLES.BUTTON__OPEN}
                        </button>
	                  </li>
	                  <li>
	                    <button class="${classNames.button} ${
			classNames.hullMods__button
		}" 
                        ${DataSet.dataHullModButtonType}="${BUTTON__TYPE.SMODS}"
						>
                            ${TITLES.BUTTON__SMODS}
                        </button>
	                  </li>
	                </ul>
	  `;
	}
}
export default new HullModView();
