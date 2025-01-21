import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";
import URL from "../../helper/url.js";
// View
import View from "../view.js";

class HullModsPopUpTableView extends View {
	_localParent = `.${classNames.tableBody}`;

	#allHullMods;
	generateMarkup() {
		this.#processData(this._data);
		const markup = `${this.#tableBodyRender()}`;
		return markup;
	}

	#processData() {
		this.#allHullMods = this._data;
	}

	#tableBodyRender() {
		// cost_capital: 24;
		// cost_cruiser: 18;
		// cost_dest: 15;
		// cost_frigate: 12;
		// name: "#Point Defense Integration";

		const opCostBasedOnShipSize = 0;
		const tagsArray = (crrHullMod) => {
			// console.log(crrHullMod);
			const arr = crrHullMod.uiTags.split(",");
			const stringReturn = arr.map((str) => `<p>${str}</p>`).join("");
			return stringReturn;
		};
		// const isWeaponInstalled = "[x]";
		const hullModIcon = (crrHullMod) => `
			<img src="./${URL.DATA}/${crrHullMod.sprite}" alt="${crrHullMod.short}" />`;

		const entryMarkup = (crrHullMod) => `
			<ul class="${classNames.tableEntries}" 
			${DataSet.dataHullModId}="${crrHullMod.id}">
				<li class="${classNames.tableEntry} ${classNames.tableIcon}">
					${hullModIcon(crrHullMod)}
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableName}">
					<p>${crrHullMod.name}</p>
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableDesc}">
					<p>${crrHullMod.desc}</p>
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableType}">
					<div>${tagsArray(crrHullMod)}</div>
				</li>
				<li class="${classNames.tableEntry}"><p>${opCostBasedOnShipSize}</p></li>
			</ul>
		`;
		return this.#allHullMods.map((hullMod) => entryMarkup(hullMod)).join("");

		// const entryMarkup = (crrWpn) => `
		// 	<ul class="${classNames.tableEntries}"
		// 		${DataSet.dataWeaponPopUpId}="${crrWpn.id}">

		// 		<li class="${classNames.tableEntry} ${classNames.tableIcon}">
		// 		</li>
		// 		<li class="${classNames.tableEntry} ${classNames.tableName}">${crrWpn.name}</li>
		// 		<li class="${classNames.tableEntry}">
		// 			${crrWpn.type}
		// 		</li>
		// 		<li class="${classNames.tableEntry}">${crrWpn.range}</li>
		// 		<li class="${classNames.tableEntry}">${crrWpn.oPs}</li>
		// 	</ul>
		// 	`;

		// return currentWeaponArray.map((crrWpn) => entryMarkup(crrWpn)).join("");
	}
}
export default new HullModsPopUpTableView();
