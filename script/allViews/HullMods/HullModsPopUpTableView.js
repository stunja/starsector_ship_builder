import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";
import URL from "../../helper/url.js";
// View
import View from "../view.js";

const CLASSES = {
	WEAPON_POP_UP_ACTIVE: "weaponPopUpActive",
};

const STRING = {
	HEADER: "Fighter Bays",
	EMPTY: "",
	SPACE: " ",
};

class HullModsPopUpTableView extends View {
	_localParent = `.${classNames.tableBody}`;

	#allHullMods;
	#userShipBuild;
	#hullSize;
	#hullMods;
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
		this.#hullMods = this.#userShipBuild.hullMods;
	}

	#tagsArray = (crrHullMod) =>
		crrHullMod.uiTags
			.split(",")
			.map((str) => `<p>${str}</p>`)
			.join("");

	#opCostPerHullSize = {
		CAPITAL_SHIP: "cost_capital",
		CRUISER: "cost_cruiser",
		DESTROYER: "cost_dest",
		FRIGATE: "cost_frigate",
	};
	#hullModIcon = (crrHullMod) => `
			<img src="./${URL.DATA}/${crrHullMod.sprite}" alt="${crrHullMod.short}" />`;

	#assignActiveClass = (currentHullMod) => {
		const installedHullMods = this.#hullMods.installedHullMods;

		if (
			!currentHullMod ||
			!Array.isArray(installedHullMods) ||
			installedHullMods.length === 0
		) {
			return STRING.EMPTY;
		}

		const isActive = installedHullMods.includes(currentHullMod.id);

		return isActive
			? STRING.SPACE + classNames.weaponPopUpActive
			: STRING.EMPTY;
	};

	#tableBodyRender() {
		const normalizedHullSize = this.#opCostPerHullSize[this.#hullSize];
		const entryMarkup = (crrHullMod) => {
			return `
			<ul class="${classNames.tableEntries} ${
				classNames.tableEntries
			}${this.#assignActiveClass(crrHullMod)}" 
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
