import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";
import URL from "../../helper/url.js";
// View
import View from "../view.js";
import { normalizedHullSize } from "../../components/Hullmods/HullModHelper.js";
import { GENERIC_STRING } from "../../helper/MagicStrings.js";
// Helper

const HULLMOD_ARRAY_TYPE = {
	AVAILABLE: "AVAILABLE",
	UNAVAILABLE: "UNAVAILABLE",
};
class HullModsPopUpTableView extends View {
	_localParent = `.${classNames.tableBody}`;

	#availableHullMods;
	#unAvailableMods;
	#userShipBuild;
	#hullSize;
	generateMarkup() {
		this.#processData(this._data);

		const markup = `
			${this.#greenArrayRender()}
			${this.#redArrayRender()}
		`;
		return markup;
	}

	#processData() {
		const [availableHullMods, unAvailableMods, userShipBuild] = this._data;

		this.#availableHullMods = availableHullMods;
		this.#unAvailableMods = unAvailableMods;
		this.#userShipBuild = userShipBuild;

		this.#hullSize = this.#userShipBuild.hullSize;
	}

	#tagsArray = (crrHullMod) =>
		crrHullMod.uiTags
			.split(",")
			.map((str) => `<p>${str}</p>`)
			.join(GENERIC_STRING.EMPTY);

	#hullModIcon = (crrHullMod) => `
			<img src="./${URL.DATA}/${crrHullMod.sprite}" alt="${crrHullMod.short}" />`;

	#hullModDescription(currentHullMod) {
		const regularValues = currentHullMod.effectValues.regularValues;
		const description = currentHullMod.desc;
		const currentNumber = regularValues.slice();

		const changeDescription = () => {
			return description.replace(
				/%s/g,
				() =>
					`<span class="${
						classNames.hullModDescValues
					}">${currentNumber.shift()}</span>`
			);
		};
		//prettier-ignore
		return `<li class="${classNames.tableEntry} ${classNames.tableDesc}"><p>${changeDescription()}</p></li>`;
	}
	#typeMarkup = (currentHullMod) =>
		`<li class="${classNames.tableEntry} ${classNames.tableType}">
			<div>${this.#tagsArray(currentHullMod)}</div>
		</li>`;

	#opCostMarkup = (currentHullMod) =>
		`<li class="${classNames.tableEntry}">
			<p>${normalizedHullSize(currentHullMod, this.#hullSize)}</p>
		</li>`;

	#reasonMarkup = (string) => {
		const stringMarkup = string ? `<p>${string}</p>` : `<i>&#10003</i>`;

		return `<li class="${classNames.tableEntry} ${classNames.tableInstalledIcon}">
					${stringMarkup}
				</li>`;
	};

	#singleEntryMarkup(crrHullMod, arrayType) {
		const [currentHullMod, reason] = crrHullMod;

		const availableOrUnavailableArray =
			arrayType === HULLMOD_ARRAY_TYPE.AVAILABLE
				? classNames.tableEntryAvailable
				: classNames.tableEntryUnavailable;

		return `
			<ul class="${classNames.tableEntries} ${availableOrUnavailableArray}" 
				${DataSet.dataHullModId}="${currentHullMod.id}"
			>
				<li class="${classNames.tableEntry} ${classNames.tableIcon}">
					${this.#hullModIcon(currentHullMod)}
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableName}">
					<p>${currentHullMod.name}</p>
				</li>
				${this.#hullModDescription(currentHullMod)}
				${this.#typeMarkup(currentHullMod)}
				${this.#opCostMarkup(currentHullMod)}
				${this.#reasonMarkup(reason)}
			</ul>`;
	}

	#greenArrayRender() {
		const arrayType = HULLMOD_ARRAY_TYPE.AVAILABLE;

		// wrap in an array, so mods looks like
		return this.#availableHullMods
			.map((hullMod) => this.#singleEntryMarkup([hullMod], arrayType))
			.join(GENERIC_STRING.EMPTY);
	}

	#redArrayRender() {
		const arrayType = HULLMOD_ARRAY_TYPE.UNAVAILABLE;

		return this.#unAvailableMods
			.map((hullMod) => this.#singleEntryMarkup(hullMod, arrayType))
			.join(GENERIC_STRING.EMPTY);
	}
}
export default new HullModsPopUpTableView();
