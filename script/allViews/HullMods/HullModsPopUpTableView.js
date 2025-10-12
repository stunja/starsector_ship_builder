// View
import View from "../view.js";
import HullModSprite from "./HullModSprite.js";
//
// Helper
import { GENERIC_STRING } from "../../helper/ui/ui_main.js";
// import { imageLoader } from "../../helper/helperFunction.js";
import HullModHelper from "../../components/Hullmods/HullModHelper.js";
import CLASS_NAMES from "../../helper/ui/class_names.js";
import DATASET from "../../helper/ui/datasets.js";
// import URL from "../../helper/url.js";

const HULLMOD_ARRAY_TYPE = {
	AVAILABLE: "AVAILABLE",
	UNAVAILABLE: "UNAVAILABLE",
};
class HullModsPopUpTableView extends View {
	_localParent = `.${CLASS_NAMES.tableBody}`;

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
	// const hullModIcon = `<img src="./${URL.DATA}/${currentHullMod.sprite}" alt="${currentHullMod.short}" />`;

	async #tableBodyRender() {
		const entryMarkup = async (currentHullMod, arrayType) => {
			const availableOrUnavailableArray =
				arrayType === HULLMOD_ARRAY_TYPE.AVAILABLE
					? CLASS_NAMES.tableEntryAvailable
					: CLASS_NAMES.tableEntryUnavailable;

			//? idiotic implementation, but easier they fixing original code.
			//? sometimes it is an array with [obj, str(reason)] and other times just obj
			let reason = GENERIC_STRING.EMPTY;
			if (Array.isArray(currentHullMod)) {
				[currentHullMod, reason] = currentHullMod;
			}
			try {
				const imgSprite = await HullModSprite.renderElement(currentHullMod);

				return `
						<ul class="${CLASS_NAMES.tableEntries} ${availableOrUnavailableArray}" 
							${DATASET.dataHullModId}="${currentHullMod.id}"
						>
							<li class="${CLASS_NAMES.tableEntry} ${CLASS_NAMES.tableIcon}">
								${imgSprite}
							</li>
							<li class="${CLASS_NAMES.tableEntry} ${CLASS_NAMES.tableName}">
								<p>${currentHullMod.name}</p>
							</li>
							${this.#hullModDescription(currentHullMod)}
							${this.#typeMarkup(currentHullMod)}
							${this.#opCostMarkup(currentHullMod)}
							${this.#reasonMarkup(reason)}
						</ul>
						`;
			} catch (error) {
				console.error("Failed to load hullMod sprites:", error);
				return GENERIC_STRING.EMPTY;
			}
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
						CLASS_NAMES.hullModDescValues
					}">${currentNumber.shift()}</span>`
			);
		};
		//prettier-ignore
		return `<li class="${CLASS_NAMES.tableEntry} ${CLASS_NAMES.tableDesc}"><p>${changeDescription()}</p></li>`;
	}
	#typeMarkup = (currentHullMod) => {
		return `
			<li class="${CLASS_NAMES.tableEntry} ${CLASS_NAMES.tableType}">
				<div>${this.#tagsArray(currentHullMod)}</div>
			</li>
		`;
	};

	#opCostMarkup = (currentHullMod) => {
		return `
			<li class="${CLASS_NAMES.tableEntry}">
				<p>${HullModHelper.normalizedHullSize(currentHullMod, this.#hullSize)}</p>
			</li>
			`;
	};

	#reasonMarkup = (string) => {
		const stringMarkup = string
			? `<p>${string}</p>`
			: `<i>${GENERIC_STRING.CHECKMARK}</i>`;

		return `<li class="${CLASS_NAMES.tableEntry} ${CLASS_NAMES.tableInstalledIcon}">
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
