class TablePopUpSorter {
	#isAscending;
	#currentCategory;
	#currentWeaponArray;
	update = ([btn, currentWeaponArray]) => {
		this.#currentWeaponArray = currentWeaponArray;
		console.log(this.#currentWeaponArray);
		this.#weaponPopUpTableSorter(btn);

		return this.#currentWeaponArray;
	};
	#weaponPopUpTableSorter(btn) {
		// Input validation
		if (!btn?.dataset?.category) {
			throw new Error("Button must have a category in its dataset");
		}

		const { category } = btn.dataset;

		// Toggle direction if clicking same category, otherwise default to ascending
		this.#isAscending =
			this.#currentCategory === category ? !this.#isAscending : true;
		this.#currentCategory = category;

		const sortConfigs = {
			name: (a, b) =>
				this.#isAscending
					? a.name.localeCompare(b.name)
					: b.name.localeCompare(a.name),
			type: (a, b) =>
				this.#isAscending
					? a.type.localeCompare(b.type)
					: b.type.localeCompare(a.type),
			range: (a, b) =>
				this.#isAscending ? a.range - b.range : b.range - a.range,
			cost: (a, b) => (this.#isAscending ? a.oPs - b.oPs : b.oPs - a.oPs), // oPs = ordinancePoints
		};

		// Check if sort configuration exists for category
		if (!sortConfigs[category]) {
			console.warn(`Unknown sort category: ${category}`);
			return;
		}

		try {
			// Try modern toSorted() first
			this.#currentWeaponArray = this.#currentWeaponArray.toSorted(
				sortConfigs[category]
			);
		} catch (error) {
			// Fallback for browsers that don't support toSorted()
			this.#currentWeaponArray = [...this.#currentWeaponArray].sort(
				sortConfigs[category]
			);
		}
	}
}
export default new TablePopUpSorter();
