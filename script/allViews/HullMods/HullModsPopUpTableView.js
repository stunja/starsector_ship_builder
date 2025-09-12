import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";
import URL from "../../helper/url.js";
// View
import View from "../view.js";
import { GENERIC_STRING } from "../../helper/MagicStrings.js";
import HullModHelper from "../../components/Hullmods/HullModHelper.js";
import { imageLoader } from "../../helper/helperFunction.js";
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
	async generateMarkup() {
		this.#processData(this._data);

		const markup = this.#tableBodyRender();
		return markup;
	}

	#processData() {
		const [availableHullMods, unAvailableMods, userShipBuild] = this._data;

		this.#availableHullMods = availableHullMods;
		this.#unAvailableMods = unAvailableMods;
		this.#userShipBuild = userShipBuild;

		this.#hullSize = this.#userShipBuild.hullSize;
	}

	async #tableBodyRender() {
		const entryMarkup = async (currentHullMod, arrayType) => {
			const availableOrUnavailableArray =
				arrayType === HULLMOD_ARRAY_TYPE.AVAILABLE
					? classNames.tableEntryAvailable
					: classNames.tableEntryUnavailable;

			//? idiotic implementation, but easier they fixing original code.
			//? sometimes it is an array with [obj, str(reason)] and other times just obj
			let reason = GENERIC_STRING.EMPTY;
			if (Array.isArray(currentHullMod)) {
				[currentHullMod, reason] = currentHullMod;
			}

			const hullModSprite = await imageLoader(currentHullMod.sprite);
			hullModSprite.alt = `Image of a ${currentHullMod.name}`;
			// const hullModIcon = `<img src="./${URL.DATA}/${currentHullMod.sprite}" alt="${currentHullMod.short}" />`;

			console.log(hullModSprite);
			return `
			<ul class="${classNames.tableEntries} ${availableOrUnavailableArray}" 
				${DataSet.dataHullModId}="${currentHullMod.id}"
			>
				<li class="${classNames.tableEntry} ${classNames.tableIcon}">
					${hullModSprite}
				</li>
				<li class="${classNames.tableEntry} ${classNames.tableName}">
					<p>${currentHullMod.name}</p>
				</li>
				${this.#hullModDescription(currentHullMod)}
				${this.#typeMarkup(currentHullMod)}
				${this.#opCostMarkup(currentHullMod)}
				${this.#reasonMarkup(reason)}
			</ul>
			`;
		};

		const markupArray = await Promise.all([
			...this.#availableHullMods.map((hullMod) =>
				entryMarkup(hullMod, HULLMOD_ARRAY_TYPE.AVAILABLE)
			),
			...this.#unAvailableMods.map((hullMod) =>
				entryMarkup(hullMod, HULLMOD_ARRAY_TYPE.UNAVAILABLE)
			),
		]);

		return markupArray.join(GENERIC_STRING.EMPTY);
	}

	#tagsArray(crrHullMod) {
		return crrHullMod.uiTags
			.split(GENERIC_STRING.COMMA)
			.map((str) => `<p>${str}</p>`)
			.join(GENERIC_STRING.EMPTY);
	}

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
	#typeMarkup = (currentHullMod) => {
		return `
			<li class="${classNames.tableEntry} ${classNames.tableType}">
				<div>${this.#tagsArray(currentHullMod)}</div>
			</li>
		`;
	};

	#opCostMarkup = (currentHullMod) => {
		return `
			<li class="${classNames.tableEntry}">
				<p>${HullModHelper.normalizedHullSize(currentHullMod, this.#hullSize)}</p>
			</li>
			`;
	};

	#reasonMarkup = (string) => {
		const stringMarkup = string
			? `<p>${string}</p>`
			: `<i>${GENERIC_STRING.CHECKMARK}</i>`;

		return `<li class="${classNames.tableEntry} ${classNames.tableInstalledIcon}">
					${stringMarkup}
				</li>`;
	};
	// async #greenArrayRender() {
	// 	const arrayType = HULLMOD_ARRAY_TYPE.AVAILABLE;

	// 	// wrap in an array, so mods looks like
	// 	return this.#availableHullMods
	// 		.map((hullMod) => this.#singleHullModEntry([hullMod], arrayType))
	// 		.join(GENERIC_STRING.EMPTY);
	// }

	// async #redArrayRender() {
	// 	const arrayType = HULLMOD_ARRAY_TYPE.UNAVAILABLE;

	// 	return this.#unAvailableMods
	// 		.map((hullMod) => this.#singleHullModEntry(hullMod, arrayType))
	// 		.join(GENERIC_STRING.EMPTY);
	// }
}
export default new HullModsPopUpTableView();
