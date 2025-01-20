import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";
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
		console.log(this.#allHullMods);

		// baseValue: 10000;
		// cost_capital: 24;
		// cost_cruiser: 18;
		// cost_dest: 15;
		// cost_frigate: 12;
		// desc: "Reduces the ordnance point cost of small point-defense weapons by %s. The cost reduction only affects weapons that have PD capability as a feature of the weapon itself, and not when it's gained through other means such as from a hullmod.\r\n\r\nIn addition, all point-defense weapons deal %s more damage to all targets.";
		// hidden: "";
		// hiddenEverywhere: "";
		// id: "pdintegration";
		// name: "#Point Defense Integration";
		// rarity: "";
		// sModDesc: "";
		// script: "com.fs.starfarer.api.impl.hullmods.PDIntegration";
		// short: "Reduces ordnance point cost of small PD weapons, increases all PD damage.";
		// sprite: "graphics/hullmods/integrated_point_defense_ai.png";
		// tags: "defensive, merc";
		// techManufacturer: "";
		// tier: 3;
		// uiTags: "Weapons, Defenses";
		// unlocked: "";
		const opCostBasedOnShipSize = 0;
		const tagsArray = (crrHullMod) => {
			console.log(crrHullMod);
			return crrHullMod.uiTags.split(",").join("");
		};
		// const isWeaponInstalled = "[x]";

		const entryMarkup = (crrHullMod) => `
			<ul class="${classNames.tableEntries}" 
			${DataSet.dataHullModId}="${crrHullMod.id}">
				<li class="${classNames.tableEntry} ${classNames.tableIcon}">ICON</li>
				<li class="${classNames.tableEntry} ${classNames.tableName}">
					<p>${crrHullMod.name}</p>
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableDesc}">
					<p>${crrHullMod.desc}</p>
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableType}">
					<p>${tagsArray(crrHullMod)}</p>
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
