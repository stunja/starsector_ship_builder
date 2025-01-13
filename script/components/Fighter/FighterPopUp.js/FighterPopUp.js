class FighterPopUp {}
export default new FighterPopUp();
//! Should be united into ONE
// fighterPopUpTableSorter(btn) {
// 	const category = btn.dataset.category;
// 	const {
// 		previousSortState,
// 		isAscending,
// 		currentFighterArray: originalArrayState,
// 	} = model.uiState.fighterPopUp;
// 	const currentWeaponSlot = model.uiState.currentWeaponSlot;
// 	const currentInstalledWeapons =
// 		model.state.currentShipBuild.currentInstalledWeapons;

// 	// Mapping of sort categories to their corresponding object keys and sort types
// 	const SORT_CONFIGS = {
// 		name: { key: "id", type: "text" },
// 		role: { key: "role", type: "text" },
// 		wing: { key: "num", type: "number" },
// 		range: { key: "range", type: "number" },
// 		cost: { key: "op_cost", type: "number" },
// 	};

// 	// Determine the new sort direction
// 	const newIsAscending = previousSortState !== category ? true : !isAscending;

// 	// Perform sorting if the category is valid
// 	const sortConfig = SORT_CONFIGS[category];
// 	if (!sortConfig) {
// 		console.warn(`Invalid sort category: ${category}`);
// 		return;
// 	}

// 	const currentArrayState = originalArrayState.toSorted((a, b) => {
// 		const valueA = a[sortConfig.key];
// 		const valueB = b[sortConfig.key];

// 		if (sortConfig.type === "text") {
// 			return newIsAscending
// 				? valueA.localeCompare(valueB)
// 				: valueB.localeCompare(valueA);
// 		}

// 		if (sortConfig.type === "number") {
// 			return newIsAscending ? valueB - valueA : valueA - valueB;
// 		}
// 	});

// 	// Update model state
// 	model.uiState.fighterPopUp = {
// 		...model.uiState.fighterPopUp,
// 		isAscending: newIsAscending,
// 		previousSortState: category,
// 		currentArrayState,
// 	};
// 	// Render updated component
// 	FighterPopUpTableView.renderComponent(
// 		FighterPopUpTableView.tableContentRender(
// 			currentArrayState,
// 			currentInstalledWeapons,
// 			[currentWeaponSlot]
// 		)
// 	);
// },
// //! should not be here
// #fighterBayAddFightersToButton(wpnId, currentWeaponSlot) {
//     const currentWeaponsArray = model.uiState.fighterPopUp.currentFighterArray;
//     const currentWeapon = currentWeaponsArray.find(
//         (currentWeapon) => currentWeapon.id === wpnId
//     );

//     builderLeftView.renderComponent(
//         builderLeftView.figherBayAddFighterRender(
//             currentWeapon,
//             currentWeaponSlot
//         )
//     );
// }

//  fighterPopUpRender() {
// 	const currentFighterArray = model.uiState.fighterPopUp.currentFighterArray;
// 	const currentInstalledWeapons =
// 		model.state.currentShipBuild.currentInstalledWeapons;
// 	const currentWeaponSlot = model.uiState.currentWeaponSlot;

// 	FighterPopUpTableView.renderComponent(FighterPopUpTableView.render());
// 	FighterPopUpTableView.renderComponent(
// 		FighterPopUpTableView.tableHeaderRender()
// 	);
// 	FighterPopUpTableView.renderComponent(
// 		FighterPopUpTableView.tableContentRender(
// 			currentFighterArray,
// 			currentInstalledWeapons,
// 			currentWeaponSlot
// 		)
// 	);
// 	//! why this is here?
// 	// EventHandlers.removeEventListener(builderLogic.removeCurrentFighterFromPopUpToTheShip);
// 	// EventHandlers.addEventListenerReturnDataSet(builderLeftView.fighterPopUpRemoveCurrentWeapon(builderLogic.removeCurrentFighterFromPopUpToTheShip));
// },
//
// clearFighterPopUp() {
// 	let isPopUpOpen = model.uiState.fighterPopUp.isPopUpOpen;
// 	builderLeftView.fighterBayButtonRemoveAllActiveClasses();
// 	isPopUpOpen = !isPopUpOpen;
// 	// model.uiState.currentWeaponSlot = "";
// 	model.uiState.currentWeaponHover = "";
// },
// Buttons
// fighterBayButton(btn) {
// 	const { fighterId } = btn.dataset;
// 	const allFighters = model.state.allFighters;
// 	const _baseWeaponSlots = model.state.currentShipBuild._baseWeaponSlots;
// 	const currentWeaponSlot = model.uiState.currentWeaponSlot;
// 	const isPopUpOpen = model.uiState.fighterPopUp.isOpen;

// 	const [newWeaponSlot] = _baseWeaponSlots.filter(
// 		(slot) => slot.id === fighterId
// 	);

// 	if (currentWeaponSlot === newWeaponSlot && isPopUpOpen) {
// 		builderLogic.clearFighterPopUp(isPopUpOpen);
// 		return;
// 	}

// 	const sortedFighterArray = allFighters.toSorted(
// 		(a, b) => b.op_cost - a.op_cost
// 	);

// 	// model.uiState.weaponPopUp.currentWeaponTypes = currentWeaponTypes;
// 	model.uiState.fighterPopUp.currentFighterArray = sortedFighterArray;
// 	model.uiState.currentWeaponSlot = newWeaponSlot;

// 	// eventListener to close fighter menu
// 	// builderLogic.fighterPopUpTableSorter(btn);
// 	builderLogic.fighterPopUpRender();
// 	builderLogic.fighterPopUpHandlers();
// 	builderLeftView.fighterBayActiveWeaponSlot(fighterId);
// },

// removeCurrentFighterFromPopUpToTheShip(btn) {
// 	// const weaponId = btn.dataset.id;
// 	const currentInstalledWeapons = model.state.currentShipBuild.currentInstalledWeapons;
// 	const currentFighterArray = model.uiState.fighterPopUp.currentFighterArray;
// 	const currentWeaponSlot = model.uiState.currentWeaponSlot;

// 	const newInstalledWeapons = currentInstalledWeapons.map(([slotId, currentWeapon]) =>
// 		slotId === currentWeaponSlot.id ? [slotId, ""] : [slotId, currentWeapon]
// 	);

// 	builderLogic.removeCurrentWeaponAndFighterSlot("fighter");
// 	FighterPopUpTable.renderComponent(FighterPopUpTable.tableContentRender(currentFighterArray, newInstalledWeapons, currentWeaponSlot.id));

// 	//! bad implementation, but it works
// 	EventHandlers.removeEventListener(builderLogic.addCurrentWeaponFromPopUpToTheShip);
// 	EventHandlers.addEventListenerReturnDataSet(builderLeftView.fighterPopUpTableHandler(builderLogic.addCurrentWeaponFromPopUpToTheShip));

// 	model.state.currentShipBuild.currentInstalledWeapons = newInstalledWeapons;
// },
////////////
// controller() {
// 	// const baseWeaponSlots = model.state.currentShipBuild._baseWeaponSlots;

// 	// builderCenterView.shipSpriteUpdate();

// 	// click on fighter Slot
// 	EventHandlers.removeEventListener(builderLogic.fighterBayButton);
// 	EventHandlers.addEventListenerReturnDataSet(
// 		EventHandlers.fighterSlotHandler(builderLogic.fighterBayButton)
// 	);

// 	// Add Hover Handler on Fighter Slots
// 	// EventHandlers.removeEventListener(builderLogic.showMoreInformationFighterWeaponSlot);
// 	// EventHandlers.addEventListenerReturnDataSet(EventHandlers.fighterShowAdditionaInformation(builderLogic.showMoreInformationFighterWeaponSlot));
// }
// showMoreInformationFighterWeaponSlot(btn) {
// 	const buttonId = btn.dataset.fighterId;

// 	const currentInstalledWeapons =
// 		model.state.currentShipBuild.currentInstalledWeapons;

// 	const isFighterInstalled = currentInstalledWeapons.find(
// 		(wpn) => wpn[0] === buttonId && wpn[1] !== ""
// 	);
// 	if (isFighterInstalled) {
// 		const fighterId = isFighterInstalled[1];
// 		model.uiState.currentWeaponHover = "";
// 		builderLogic.showAdditionalInformationOnHoverForFighter(fighterId);
// 	}
// }

//

//! 24 / 12
//! I need to remove table weapon-pop-up__table
// showAdditionalInformationOnHoverForFighter(btn) {
// 	const id = btn.dataset?.id ?? btn; // this is fighterId not buttonSlotId
// 	const { fighterPopUp, currentWeaponHover } = model.uiState;
// 	const { allWeapons, allShipHulls } = model.state;
// 	model.uiState.currentWeaponHover = id;

// 	const currentHoverWeaponObject = fighterPopUp.currentFighterArray.find(
// 		(fighterObject) => fighterObject.id === id
// 	);

// 	FighterPopUpTableHoverView.renderComponent(
// 		FighterPopUpTableHoverView.hoverAdditionalInformationRender(
// 			currentHoverWeaponObject,
// 			allWeapons,
// 			allShipHulls
// 		)
// 	);
// },
