const opCostPerHullSize = {
	CAPITAL_SHIP: "cost_capital",
	CRUISER: "cost_cruiser",
	DESTROYER: "cost_dest",
	FRIGATE: "cost_frigate",
};

class TablePopUpSorter {
	#isAscending;
	#currentCategory;
	#hullSize;

	#SORT_TYPE = {
		text: (textA, textB) =>
			this.#isAscending
				? textA.localeCompare(textB)
				: textB.localeCompare(textA),
		number: (propA, propB) =>
			this.#isAscending ? propA - propB : propB - propA,
	};

	#SORT_WEAPON_TABLE = {
		name: (a, b) => this.#SORT_TYPE.text(a.name, b.name),
		type: (a, b) => this.#SORT_TYPE.text(a.type, b.type),
		range: (a, b) => this.#SORT_TYPE.number(a.range, b.range),
		cost: (a, b) => this.#SORT_TYPE.number(a.oPs, b.oPs), // oPs = ordinancePoints
	};
	#SORT_FIGHTER_TABLE = {
		// name // role // wing // range // cost
		name: (a, b) =>
			this.#SORT_TYPE.text(a.additionalData.name, b.additionalData.name),
		role: (a, b) => this.#SORT_TYPE.text(a.role, b.role),
		range: (a, b) => this.#SORT_TYPE.number(a.range, b.range),
		wing: (a, b) => this.#SORT_TYPE.number(a.num, b.num),
		cost: (a, b) => this.#SORT_TYPE.number(a.opCost, b.opCost),
	};

	#SORT_HULLMOD_TABLE = {
		name: (a, b) => this.#SORT_TYPE.text(b.name, a.name),
		type: (a, b) => this.#SORT_TYPE.text(a.uiTags, b.uiTags),
		cost: (a, b) =>
			this.#SORT_TYPE.number(a[this.#hullSize], b[this.#hullSize]),
	};

	update([category, tableType, currentArray, userShipBuild]) {
		this.#hullSize = opCostPerHullSize[userShipBuild?.hullSize];

		// Use different data between Tables
		const sortTableType =
			tableType === "weaponPopUpTable"
				? this.#SORT_WEAPON_TABLE
				: tableType === "fighterPopUpTable"
				? this.#SORT_FIGHTER_TABLE
				: this.#SORT_HULLMOD_TABLE;

		// Toggle direction if clicking same category, otherwise default to ascending
		this.#isAscending =
			this.#currentCategory === category ? !this.#isAscending : true;
		this.#currentCategory = category;

		// Check if sort configuration exists for category
		if (!sortTableType[category]) {
			console.warn(`Unknown sort category: ${category}`);
			return;
		}

		try {
			// Try modern toSorted() first
			currentArray = currentArray.toSorted(sortTableType[category]);
		} catch (error) {
			// Fallback for browsers that don't support toSorted()
			currentArray = [...currentArray].sort(sortTableType[category]);
		}
		return currentArray;
	}
}
export default new TablePopUpSorter();
