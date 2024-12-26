import classNames from "../helper/DomClassNames";

class ShipBuilderController {
	controller() {
		const baseWeaponSlots = model.state.currentShipBuild._baseWeaponSlots;

		builderCenterView.renderComponent(
			builderCenterView.weaponSlotRender(baseWeaponSlots)
		);
		builderCenterView.weaponSlotChangePosition(model.state);
		builderCenterView.weaponArcAndAngleChangeCoords();
		builderCenterView.shipSpriteUpdate();

		// click on fighter Slot
		EventHandlers.removeEventListener(builderLogic.fighterBayButton);
		EventHandlers.addEventListenerReturnDataSet(
			EventHandlers.fighterSlotHandler(builderLogic.fighterBayButton)
		);
		// click on slot, open table
		EventHandlers.removeEventListener(builderLogic.weaponButton);
		EventHandlers.addEventListenerReturnDataSet(
			WeaponPopUpHandlers.weaponButtonHandler(builderLogic.weaponButton)
		);
		// Add Hover Handler on Fighter Slots
		// EventHandlers.removeEventListener(builderLogic.showMoreInformationFighterWeaponSlot);
		// EventHandlers.addEventListenerReturnDataSet(EventHandlers.fighterShowAdditionaInformation(builderLogic.showMoreInformationFighterWeaponSlot));
	}
	showMoreInformationFighterWeaponSlot(btn) {
		const buttonId = btn.dataset.fighterId;

		const currentInstalledWeapons =
			model.state.currentShipBuild.currentInstalledWeapons;

		const isFighterInstalled = currentInstalledWeapons.find(
			(wpn) => wpn[0] === buttonId && wpn[1] !== ""
		);
		if (isFighterInstalled) {
			const fighterId = isFighterInstalled[1];
			model.uiState.currentWeaponHover = "";
			builderLogic.showAdditionalInformationOnHoverForFighter(fighterId);
		}
	}
	weaponPopUpHandlers() {
		// Enables Sorting

		EventHandlers.removeEventListener(builderLogic.weaponPopUpTableSorter);
		EventHandlers.addEventListenerReturnDataSet(
			WeaponPopUpHandlers.headerHandler(builderLogic.weaponPopUpTableSorter)
		);

		WeaponPopUpHandlers.closeIfClickOutsideTargetContainer(
			classNames.tableContainer
		);

		/////
		EventHandlers.removeEventListener(builderLogic.addCurrentWeapon);
		EventHandlers.addEventListenerReturnDataSet(
			WeaponPopUpHandlers.tableHandler(builderLogic.addCurrentWeapon)
		);
		// Table Hover Effect Handler
		// EventHandlers.removeEventListener(builderLogic.showAdditionalInformationOnHover);
		// EventHandlers.addEventListenerReturnDataSet(WeaponPopUpHandlers.weaponPopUpHoverEffect(builderLogic.showAdditionalInformationOnHover));
		//? Very different Logic (runs once)
		// EventHandlers.hidePopUpIfClickOutsideHandler(classNames.weaponPopUp, classNames.weaponPopUpTableWrapper, builderLogic.clearWeaponPopUp);

		// Hide PopUp via Button Handler
		// builderCenterView.removeEventListener(builderLogic.weaponPopUpHide);
		// builderCenterView.addEventListenerReturnDataSet(WeaponPopUpHandlers.weaponPopUpHideButtonHandler(builderLogic.weaponPopUpHide));
	}

	weaponPopUpRender() {
		// Renders After User Clicks on Weapon Button (Weapon Slot)
		const currentWeaponArray = model.uiState.weaponPopUp.currentWeaponArray;
		const currentInstalledWeapons =
			model.state.currentShipBuild.currentInstalledWeapons;
		const currentWeaponSlot = model.uiState.currentWeaponSlot;

		//? Strange way to render, but it works.
		//? first draw "empty" container
		//? then target it with other renders
		//? I dont remember why I did it like this. (Probably due to reDraw Logic)

		// Render Base Container
		WeaponPopUpView.renderComponent(
			WeaponPopUpView.tableContainerRender(
				currentWeaponArray,
				currentInstalledWeapons,
				currentWeaponSlot
			)
		);

		// Renders the Head
		WeaponPopUpView.renderComponent(WeaponPopUpView.tableHeaderRender());

		// Renders the Table
		WeaponPopUpView.renderComponent(
			WeaponPopUpView.tableBodyRender(currentWeaponArray)
		);

		// Why Do i render 3 different thing here
		// builderCenterView.renderComponent(builderCenterView.weaponPopUpRender());
		// builderCenterView.renderComponent(builderCenterView.weaponPopUpTableHeader());
		// builderCenterView.renderComponent(builderCenterView.weaponPopUpTableContentRender(currentWeaponArray, currentInstalledWeapons, currentWeaponSlot));

		// Handlers
		//! why this is here? It should not be here
		//! This removes weapon from weapon slot.
		// EventHandlers.removeEventListener(builderLogic.removeCurrentWeaponFromPopUpToTheShip);
		// EventHandlers.addEventListenerReturnDataSet(builderCenterView.weaponPopUpRemoveCurrentWeapon(builderLogic.removeCurrentWeaponFromPopUpToTheShip));
	}

	clearWeaponPopUp() {
		// model.uiState.currentWeaponSlot = "";
		model.uiState.currentWeaponHover = "";
	}

	weaponButton(btn) {
		const { id } = btn.dataset;
		const { _baseWeaponSlots } = model.state.currentShipBuild;
		const { allWeapons } = model.state;

		//? Filter from 170 => 110
		// I didnt filter in model, because fighters are there too. bizarre
		// Weapons / Fighters / other stuff.
		const filteredWeapons = allWeapons.filter(
			(weapon) =>
				weapon.id !== "" &&
				weapon.tier !== "" &&
				weapon.hints !== "SYSTEM" &&
				weapon.tags !== "SYSTEM" &&
				"restricted" &&
				weapon.groupTag !== "restricted"
		);
		// const [currentWeaponSlot] = (model.uiState.weaponPopUp.currentWeaponSlot = _baseWeaponSlots.filter((slot) => slot.id === id));
		const [currentWeaponSlot] = _baseWeaponSlots.filter(
			(slot) => slot.id === id
		);
		const generalFilter = (weaponArray, currentSlot) => {
			const SIZE = {
				LARGE: "LARGE",
				MEDIUM: "MEDIUM",
				SMALL: "SMALL",
			};
			const mountType = {
				BALLISTIC: "BALLISTIC",
				ENERGY: "ENERGY",
				MISSILE: "MISSILE",
				HYBRID: "HYBRID",
				COMPOSITE: "COMPOSITE",
				SYNERGY: "SYNERGY",
				UNIVERSAL: "UNIVERSAL",
			};

			const sizeFilter = {
				[SIZE.LARGE]: (wpn) =>
					wpn.additionalWeaponData.size === SIZE.LARGE ||
					wpn.additionalWeaponData.size === SIZE.MEDIUM,
				[SIZE.MEDIUM]: (wpn) =>
					wpn.additionalWeaponData.size === SIZE.MEDIUM ||
					(wpn.additionalWeaponData.size === SIZE.SMALL &&
						wpn.type === wpn.additionalWeaponData.mountTypeOverride),
				[SIZE.SMALL]: (wpn) => wpn.additionalWeaponData.size === SIZE.SMALL,
			};

			const typeFilter = {
				[mountType.BALLISTIC]: (wpn) =>
					wpn.additionalWeaponData.type === mountType.BALLISTIC,
				[mountType.ENERGY]: (wpn) =>
					wpn.additionalWeaponData.type === mountType.ENERGY,
				[mountType.MISSILE]: (wpn) =>
					wpn.additionalWeaponData.type === mountType.MISSILE,
				[mountType.HYBRID]: (wpn) =>
					wpn.additionalWeaponData.type === mountType.BALLISTIC ||
					wpn.additionalWeaponData.type === mountType.ENERGY ||
					wpn.additionalWeaponData.mountTypeOverride === mountType.HYBRID,
				[mountType.COMPOSITE]: (wpn) =>
					wpn.additionalWeaponData.type === mountType.BALLISTIC ||
					wpn.additionalWeaponData.type === mountType.MISSILE ||
					wpn.additionalWeaponData.mountTypeOverride === mountType.COMPOSITE,
				[mountType.SYNERGY]: (wpn) =>
					wpn.additionalWeaponData.type === mountType.ENERGY ||
					wpn.additionalWeaponData.type === mountType.MISSILE ||
					wpn.additionalWeaponData.mountTypeOverride === mountType.SYNERGY,
				[mountType.UNIVERSAL]: () => true,
			};
			const typeFilterArray = weaponArray.filter(
				typeFilter[currentSlot.type] ||
					(() => {
						console.error("Invalid slot TYPE");
						return false;
					})
			);
			const sizeFilterArray = typeFilterArray.filter(
				sizeFilter[currentSlot.size] ||
					(() => {
						console.error("Invalid slot SIZE");
						return false;
					})
			);

			return sizeFilterArray.sort(
				(a, b) => Number.parseInt(b.OPs) - Number.parseInt(a.OPs)
			);
		};
		//
		const currentWeaponArray = (model.uiState.weaponPopUp.currentArrayState =
			generalFilter(filteredWeapons, currentWeaponSlot));

		const currentWeaponTypes = [
			...new Set(currentWeaponArray.map((wpn) => wpn.type)),
		];
		//
		model.uiState.weaponPopUp.currentWeaponTypes = currentWeaponTypes;
		model.uiState.weaponPopUp.currentWeaponArray = currentWeaponArray;
		model.uiState.currentWeaponSlot = currentWeaponSlot;
		//
		builderCenterView.weaponSlotActiveClass(btn);
		builderLogic.weaponPopUpRender();
		builderLogic.weaponPopUpHandlers();
	}
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
	weaponPopUpTableSorter(btn) {
		const {
			previousSortState,
			isAscending,
			currentArrayState: originalArrayState,
		} = model.uiState.weaponPopUp;

		const currentInstalledWeapons =
			model.state.currentShipBuild.currentInstalledWeapons;

		const currentWeaponSlot = model.uiState.currentWeaponSlot;

		const category = btn.dataset.category;
		// Mapping of sort categories to their corresponding object keys and sort types
		const SORT_CONFIGS = {
			name: { key: "name", type: "text" },
			type: { key: "type", type: "text" },
			range: { key: "range", type: "number" },
			cost: { key: "OPs", type: "number" },
		};

		// Determine the new sort direction
		const newIsAscending = previousSortState !== category ? true : !isAscending;

		// Perform sorting if the category is valid
		const sortConfig = SORT_CONFIGS[category];
		if (!sortConfig) return;

		const currentArrayState = originalArrayState.toSorted((a, b) => {
			const valueA = a[sortConfig.key];
			const valueB = b[sortConfig.key];

			if (sortConfig.type === "text") {
				return newIsAscending
					? valueA.localeCompare(valueB)
					: valueB.localeCompare(valueA);
			}

			if (sortConfig.type === "number") {
				return newIsAscending ? valueB - valueA : valueA - valueB;
			}
		});
		// Update model state
		model.uiState.weaponPopUp = {
			...model.uiState.weaponPopUp,
			isAscending: newIsAscending,
			previousSortState: category,
			currentArrayState,
		};

		// ReRender The body
		WeaponPopUpView.renderComponent(
			WeaponPopUpView.tableBodyRender(
				currentArrayState,
				currentInstalledWeapons,
				[currentWeaponSlot]
			)
		);
	}
	//
	addCurrentWeapon(btn) {
		// const weaponId = btn.dataset.id;
		// const { currentShipBuild } = model.state;
		// const currentWeaponSlot = model.uiState.currentWeaponSlot;
		// currentShipBuild.currentInstalledWeapons =
		// 	currentShipBuild.currentInstalledWeapons.map(([slotId, currentWeapon]) =>
		// 		slotId === currentWeaponSlot.id
		// 			? [slotId, weaponId]
		// 			: [slotId, currentWeapon]
		// 	);
		// currentWeaponSlot.type !== "LAUNCH_BAY"
		// 	? builderLogic.replaceCurrentWeaponSprite(weaponId, currentWeaponSlot)
		// 	: builderLogic.fighterBayAddFightersToButton(weaponId, currentWeaponSlot);
		// builderCenterView.weaponPopUpFormRemover(currentWeaponSlot);
		// builderLeftView.fighterBayButtonRemoveAllActiveClasses();
		// //
		// model.uiState.currentWeaponSlot = "";
	}

	removeCurrentWeaponFromPopUpToTheShip(btn) {
		// if (!btn) return;
		const weaponButtonId = btn.dataset.id;
		const currentInstalledWeapons =
			model.state.currentShipBuild.currentInstalledWeapons;
		const weaponArray = model.uiState.weaponPopUp.currentWeaponArray;
		const fighterArray = model.uiState.fighterPopUp.currentFighterArray;
		const currentWeaponSlot = model.uiState.currentWeaponSlot;

		const newInstalledWeapons = currentInstalledWeapons.map(
			([slotId, currentWeapon]) =>
				slotId === currentWeaponSlot.id ? [slotId, ""] : [slotId, currentWeapon]
		);

		console.log(model.uiState.fighterPopUp);
		const isBtnFighter =
			fighterArray &&
			fighterArray.find((fighter) => fighter.id === weaponButtonId);
		// Assign weaponArray to pass into Render.
		const weaponArrayToPass = isBtnFighter ? fighterArray : weaponArray;

		builderLogic.removeCurrentWeaponAndFighterSlot("weapon");
		builderCenterView.renderComponent(
			builderCenterView.weaponPopUpTableContentRender(
				weaponArrayToPass,
				newInstalledWeapons,
				currentWeaponSlot.id
			)
		);

		//! bad implementation, but it works
		EventHandlers.removeEventListener(
			builderLogic.addCurrentWeaponFromPopUpToTheShip
		);
		EventHandlers.addEventListenerReturnDataSet(
			builderCenterView.weaponPopUpTableHandler(
				builderLogic.addCurrentWeaponFromPopUpToTheShip
			)
		);

		model.state.currentShipBuild.currentInstalledWeapons = newInstalledWeapons;
	}
	//

	showAdditionalInformationOnHover(btn) {
		const { id } = btn.dataset;
		const { weaponPopUp, currentWeaponHover } = model.uiState;

		if (currentWeaponHover === id) return;

		const currentHoveredWeapon = weaponPopUp.currentArrayState.find(
			(weaponObj) => weaponObj.id === id
		);
		const weaponObject = weaponObjectData(currentHoveredWeapon);

		builderCenterView.renderComponent(
			builderCenterView.weaponPopUpHoverAdditionalInformationRender(
				weaponObject,
				currentHoveredWeapon
			)
		);

		model.uiState.currentWeaponHover = id;
	}
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

	replaceCurrentWeaponSprite(id, currentWeaponSlot) {
		const { allWeapons } = model.state;
		const [weaponObject] = allWeapons.filter((wpn) => wpn.id === id);

		builderCenterView.renderComponent(
			builderCenterView.addCurrentWeaponSpriteToShipRender(
				currentWeaponSlot,
				weaponObject
			)
		);
		builderCenterView.weaponArcAndAngleChangeCoords();

		builderLogic.currentWeaponSpritePxIntoRemConversion(currentWeaponSlot.id);
		builderLogic.weaponSpriteRotate(currentWeaponSlot);
	}
	weaponSpriteRotate(currentWeaponSlot) {
		const { id: weaponSlotId, angle } = currentWeaponSlot;
		const localParent = `[${DataSet.dataId}="${weaponSlotId}"]`;

		const targetElement = document.querySelector(
			`.${classNames.weaponSlot}${localParent} .${classNames.weaponSprite}`
		);
		targetElement.style.setProperty("--weapon-rotate", `${-angle}deg`);
	}
	currentWeaponSpritePxIntoRemConversion(weaponSlotId) {
		const localParent = `[${DataSet.dataId}="${weaponSlotId}"]`;
		const target = document.querySelector(
			`${localParent} .${classNames.weaponSprite}`
		);
		const targetChildren = Array.from(target.children);

		const [base, gun] = targetChildren;
		const calc = (value) => value / defaultRemSize;

		if (base) {
			const baseHeight = base.height;
			const baseWidth = base.width;

			base.style.width = `${calc(baseWidth)}rem`;
			base.style.height = `${calc(baseHeight)}rem`;
		}

		if (gun) {
			const gunHeight = gun.height;
			const gunWidth = gun.width;

			gun.style.width = `${calc(gunWidth)}rem`;
			gun.style.height = `${calc(gunHeight)}rem`;
		}
	}
	removeCurrentWeaponAndFighterSlot(type) {
		const id = model.uiState.currentWeaponSlot.id;
		const selectors = {
			weapon: `[${DataSet.dataId}="${id}"] .${classNames.weaponSprite}`,
			fighter: `[${DataSet.dataFighterId}="${id}"] .${classNames.weaponSpriteParent}`,
		};

		const selector = selectors[type];
		if (selector) {
			const element = document.querySelector(selector);
			builderCenterView.clearRender(element);
		}
	}
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

	saveNamesOfChangedData([data]) {
		if (!data) return;
		data.forEach((e) => {
			resetData.propertiesToReset.push(e);
		});
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

	toCamelCase(str) {
		return str
			.replace(/-/g, "") // Remove all hyphens
			.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
				index === 0 ? letter.toLowerCase() : letter.toUpperCase()
			)
			.replace(/\s+/g, "");
	}
}
export default new ShipBuilderController();

// fighterPopUpHandlers() {
// 	// Table Head Handler
// 	EventHandlers.removeEventListener(builderLogic.fighterPopUpTableSorter);
// 	EventHandlers.addEventListenerReturnDataSet(
// 		FighterPopUpHandlers.fighterPopUpHeaderHandler(
// 			builderLogic.fighterPopUpTableSorter
// 		)
// 	);

// 	EventHandlers.removeEventListener(
// 		builderLogic.addCurrentWeapon
// 	);
// 	EventHandlers.addEventListenerReturnDataSet(
// 		FighterPopUpHandlers.fighterPopUpTableHandler(
// 			builderLogic.addCurrentWeapon
// 		)
// 	);
// 	// Table Hover Effect Handler
// 	EventHandlers.removeEventListener(
// 		builderLogic.showAdditionalInformationOnHoverForFighter
// 	);
// 	EventHandlers.addEventListenerReturnDataSet(
// 		FighterPopUpHandlers.fighterPopUpHoverEffect(
// 			builderLogic.showAdditionalInformationOnHoverForFighter
// 		)
// 	);
// 	//
// 	EventHandlers.hidePopUpIfClickOutsideHandler(
// 		classNames.fighterPopUpContainer,
// 		classNames.weaponPopUpTableWrapper,
// 		builderLogic.clearFighterPopUp
// 	);
// },

// weaponPopUpHide() {
// 	builderCenterView.weaponPopUpFormRemover();
// },
// fighterPopUpRender() {
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
// fighterBayAddFightersToButton(wpnId, currentWeaponSlot) {
// 	const currentWeaponsArray = model.uiState.fighterPopUp.currentFighterArray;
// 	const currentWeapon = currentWeaponsArray.find(
// 		(currentWeapon) => currentWeapon.id === wpnId
// 	);

// 	builderLeftView.renderComponent(
// 		builderLeftView.figherBayAddFighterRender(
// 			currentWeapon,
// 			currentWeaponSlot
// 		)
// 	);
// },
// Similiar but different
// I can probably compress them
// removeCurrentWeaponFromPopUpToTheShip(btn) {
// 	// const weaponId = btn.dataset.id;
// 	const { currentShipBuild } = model.state;
// 	const { currentWeaponArray } = model.uiState.weaponPopUp;
// 	const { currentWeaponSlot } = model.uiState;

// 	currentShipBuild.currentInstalledWeapons = currentShipBuild.currentInstalledWeapons.map(([slotId, currentWeapon]) =>
// 		slotId === currentWeaponSlot.id ? [slotId, ""] : [slotId, currentWeapon]
// 	);

// 	builderLogic.removeCurrentWeaponAndFighterSlot("weapon");
// 	builderCenterView.renderComponent(
// 		builderCenterView.weaponPopUpTableContentRender(currentWeaponArray, currentShipBuild.currentInstalledWeapons, currentWeaponSlot.id)
// 	);

// 	//! bad implementation, but it works
// 	EventHandlers.removeEventListener(builderLogic.addCurrentWeapon);
// 	EventHandlers.addEventListenerReturnDataSet(builderCenterView.weaponPopUpTableHandler(builderLogic.addCurrentWeaponFromPopUpToTheShip));
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
