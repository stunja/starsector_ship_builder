import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";
import URL from "../../helper/url.js";
// View
import View from "../view.js";

const opCostPerHullSize = {
	CAPITAL_SHIP: "cost_capital",
	CRUISER: "cost_cruiser",
	DESTROYER: "cost_dest",
	FRIGATE: "cost_frigate",
};

class HullModsPopUpTableView extends View {
	_localParent = `.${classNames.tableBody}`;

	#allHullMods;
	#userShipBuild;
	#hullSize;
	generateMarkup() {
		this.#processData(this._data);

		const markup = `${this.#tableBodyRender()}`;
		return markup;
	}

	#processData() {
		const [allHullMods, userShipBuild] = this._data;
		this.#allHullMods = allHullMods;
		this.#userShipBuild = userShipBuild;

		this.#hullSize = this.#userShipBuild.hullSize;
	}

	#tagsArray = (crrHullMod) =>
		crrHullMod.uiTags
			.split(",")
			.map((str) => `<p>${str}</p>`)
			.join("");

	#hullModIcon = (crrHullMod) => `
			<img src="./${URL.DATA}/${crrHullMod.sprite}" alt="${crrHullMod.short}" />`;

	#tableBodyRender() {
		const normalizedHullSize = opCostPerHullSize[this.#hullSize];
		const entryMarkup = (crrHullMod) => {
			return `
			<ul class="${classNames.tableEntries}" 
				${DataSet.dataHullModId}="${crrHullMod.id}"
			>
				<li class="${classNames.tableEntry} ${classNames.tableIcon}">
					${this.#hullModIcon(crrHullMod)}
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableName}">
					<p>${crrHullMod.name}</p>
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableDesc}">
					<p>${crrHullMod.desc}</p>
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableType}">
					<div>${this.#tagsArray(crrHullMod)}</div>
				</li>
				<li class="${classNames.tableEntry}">
					<p>${crrHullMod[normalizedHullSize]}</p>
				</li>
			</ul>
		`;
		};
		return this.#allHullMods.map((hullMod) => entryMarkup(hullMod)).join("");
	}
}
export default new HullModsPopUpTableView();
