import { HULLMOD_COST_KEYS } from "../helper/ship_properties";

const SORT_TABLES = {
	WEAPON_TABLE: "weaponPopUpTable",
	FIGHTER_TABLE: "fighterPopUpTable",
	HULLMOD_TABLE: "hullModPopUpTable",
};

class TablePopUpSorter {
	#isAscending;
	#currentCategory;
	#hullSize;

	#sortType = {
		text: (textA, textB) =>
			this.#isAscending
				? textA.localeCompare(textB)
				: textB.localeCompare(textA),
		number: (propA, propB) =>
			this.#isAscending ? propA - propB : propB - propA,
	};

	#sortWeaponTable = {
		name: (a, b) => this.#sortType.text(a.name, b.name),
		type: (a, b) => this.#sortType.text(a.type, b.type),
		range: (a, b) => this.#sortType.number(a.range, b.range),
		cost: (a, b) => this.#sortType.number(a.oPs, b.oPs), // oPs = ordinancePoints
	};
	#sortFighterTable = {
		// name // role // wing // range // cost
		name: (a, b) =>
			this.#sortType.text(a.additionalData.name, b.additionalData.name),
		role: (a, b) => this.#sortType.text(a.role, b.role),
		range: (a, b) => this.#sortType.number(a.range, b.range),
		wing: (a, b) => this.#sortType.number(a.num, b.num),
		cost: (a, b) => this.#sortType.number(a.opCost, b.opCost),
	};

	#sortHullModTable = {
		name: (a, b) => this.#sortType.text(b.name, a.name),
		type: (a, b) => this.#sortType.text(a.uiTags, b.uiTags),
		cost: (a, b) => this.#sortType.number(a[this.#hullSize], b[this.#hullSize]),
	};

	update([category, tableType, currentArray, userShipBuild]) {
		this.#hullSize = HULLMOD_COST_KEYS[userShipBuild?.hullSize];

		// Use different data between Tables
		const sortTableType = () => {
			if (tableType === SORT_TABLES.WEAPON_TABLE) return this.#sortWeaponTable;

			if (tableType === SORT_TABLES.FIGHTER_TABLE)
				return this.#sortFighterTable;

			if (tableType === SORT_TABLES.HULLMOD_TABLE)
				return this.#sortHullModTable;

			throw Error("Table Pop Up Sorter: Incorrect Sorter");
		};

		// Toggle direction if clicking same category, otherwise default to ascending
		this.#isAscending =
			this.#currentCategory === category ? !this.#isAscending : true;
		this.#currentCategory = category;

		// Check if sort configuration exists for category
		if (!sortTableType()[category]) {
			console.warn(`Unknown sort category: ${category}`);
			return;
		}

		try {
			// Try modern toSorted() first
			currentArray = currentArray.toSorted(sortTableType()[category]);
		} catch (error) {
			// Fallback for browsers that don't support toSorted()
			currentArray = [...currentArray].sort(sortTableType()[category]);
		}

		return currentArray;
	}
}
export default new TablePopUpSorter();
