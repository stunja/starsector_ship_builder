import classNames from "../helper/DomClassNames";
import builderView from "../allViews/builderView.js";
import HangarContainerView from "../components/Weapons/HangarContainerView.js";

import WeaponSlotsController from "./Weapon/WeaponSlotsController.js";
import WeaponOpenPopUpMenu from "./Weapon/WeaponOpenPopUpMenu.js";
// Model
import * as model from "../model.js";

const TARGET_REM = 10; // rem for shipSpriteSize / WeaponSlotsPosition / shipGAP

class HangarController {
	init() {
		this.#containerRender();

		WeaponSlotsController.render();
		WeaponOpenPopUpMenu.addEventListener();
	}
	#containerRender() {
		builderView.renderComponent(HangarContainerView.render(model.state));

		this.#shipSpriteUpdate();
	}

	#shipSpriteUpdate() {
		const { currentShip, currentShipBuild } = model.state;
		const targetElement = document.querySelector(`.${classNames.shipSprite}`);
		const className = "currentShipSprite";
		//
		const spriteHeight = currentShip.height;
		const spriteWidth = currentShip.width;
		// const spriteOffset = currentShip.viewOffset;
		const spriteWidthRem = spriteWidth / TARGET_REM;
		const spriteHeightRem = spriteHeight / TARGET_REM;

		const createNewStyle = () => {
			// Create a new style element
			const styleSheet = document.createElement("style");
			styleSheet.type = "text/css";

			// Append the style element to the document head
			document.head.appendChild(styleSheet);

			// Insert a CSS rule into the new stylesheet
			styleSheet.sheet.insertRule(
				`.${className} { width:${spriteWidthRem}rem; height:${spriteHeightRem}rem;}`,
				styleSheet.sheet.cssRules.length
			);
		};
		createNewStyle();
		// Apply the new class to an element
		targetElement.classList.add(className);
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
export default new HangarController();

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
