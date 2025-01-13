class HullMods {
	hullModLogic() {
		const { activeHullMods } = model.state.currentShipBuild.hullMods;
		const hullModEffectLibrary = model.hullModEffectData;
		// Idea that I have, is first default all values back to base
		// then apply new values.
		//
		resetData.resetDataController();
		const listOfAllModifiedCurrentShipBuildProperties =
			this.initAllActiveHullModsEffects(activeHullMods, hullModEffectLibrary);

		this.saveNamesOfChangedData(listOfAllModifiedCurrentShipBuildProperties);

		updateRighInfoSection();
		// guard close to prevent opening menu if state is closed
		if (model.uiState.hullModsMenu.menuState === "closed") return;

		// total update of hullModsMenu (filter / list / buttons etc)
		hullModController.hullModsMenuHandlersAndRender();
		//
	}
	initAllActiveHullModsEffects(activeHullMods, hullModEffectLibrary) {
		return activeHullMods
			.map((hullMod) => {
				const camelCaseName = this.toCamelCase(hullMod.name);
				const matchingFunction = hullModEffectLibrary[camelCaseName];

				if (typeof matchingFunction === "function") {
					return matchingFunction();
				}

				return null; // or any default value you prefer if no matching function is found
			})
			.filter((result) => result !== null);
	}
}
export default new HullMods();
