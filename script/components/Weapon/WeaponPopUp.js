import ViewModel from "../../ViewModel.js";
import WeaponPopUpCreateCurrentWeaponArray from "./WeaponPopUpCreateCurrentWeaponArray.js";
// Helper
import classNames from "../../helper/DomClassNames.js";
// Views
import WeaponPopUpContainerView from "../../allViews/WeaponPopUp/WeaponPopUpContainerView.js";
import WeaponPopUpTableHeaderView from "../../allViews/WeaponPopUp/WeaponPopUpTableHeaderView.js";
import WeaponPopUpTableView from "../../allViews/WeaponPopUp/WeaponPopUpTableView.js";

export default class WeaponPopUp extends ViewModel {
	constructor(model) {
		super(model);
		console.log(this.getDataState());
	}
	update = (btn) => {
		if (!btn) return;
		const { weaponSlotId } = btn.dataset;
		this.#weaponPopUpRender(weaponSlotId);
	};
	//

	#weaponPopUpRender(weaponSlotId) {
		// Renders After User Clicks on Weapon Button (Weapon Slot)

		const state = this.getState();
		const { allWeapons } = state.dataState;
		const { userShipBuild } = state.userState;

		const weaponArrayWeaponSlot =
			WeaponPopUpCreateCurrentWeaponArray.weaponFilterArray(
				weaponSlotId,
				userShipBuild,
				allWeapons
			);

		//? Strange way to render, but it works.
		//? first draw "empty" container then target it with other renders
		WeaponPopUpContainerView.render(userShipBuild);
		WeaponPopUpTableHeaderView.render(userShipBuild);
		WeaponPopUpTableView.render([userShipBuild, ...weaponArrayWeaponSlot]);
	}

	#weaponSlotActiveClass(btn) {
		const allWeaponSlots = document.querySelectorAll(
			`.${classNames.weaponSlot}`
		);
		allWeaponSlots.forEach((weaponSlot) => {
			weaponSlot.classList.remove(`weapon-slot--active`);
			weaponSlot.classList.add(`weapons-slot--inactive`);
			if (btn) {
				btn.classList.add(`weapon-slot--active`);
				btn.classList.remove(`weapons-slot--inactive`);
			}
		});
	}
	#assignHandlers() {
		// Enables Table Head Sorting
		EventHandlers.removeEventListener(this.#weaponPopUpTableSorter);
		EventHandlers.addEventListenerReturnDataSet(
			WeaponPopUpHandlers.headerHandler(this.#weaponPopUpTableSorter)
		);

		// Close if click outside "target container"
		WeaponPopUpHandlers.closeIfClickOutsideTargetContainer(
			classNames.tableContainer
		);

		// Add Weapon
		EventHandlers.removeEventListener(this.#addCurrentWeaponToInstalledWeapons);
		EventHandlers.addEventListenerReturnDataSet(
			WeaponPopUpHandlers.tableHandler(this.#addCurrentWeaponToInstalledWeapons)
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

	#weaponPopUpTableSorter(btn) {
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

	// #addCurrentWeaponToInstalledWeapons(btn) {
	// 	// Click once to add, click two times to remove
	// 	const { weaponPopUpId } = btn.dataset;
	// 	const { currentShipBuild } = model.state;

	// 	const currentWeaponSlot = model.uiState.currentWeaponSlot;

	// 	currentShipBuild.currentInstalledWeapons =
	// 		currentShipBuild.currentInstalledWeapons.map(
	// 			([slotId, currentWeapon]) => {
	// 				return slotId === currentWeaponSlot.id &&
	// 					currentWeapon === weaponPopUpId
	// 					? [slotId, ""]
	// 					: slotId === currentWeaponSlot.id
	// 					? [slotId, weaponPopUpId]
	// 					: [slotId, currentWeapon];
	// 			}
	// 		);

	// 	HangarController.updateWeaponSprites();
	// }
	#addCurrentWeaponToInstalledWeapons = (btn) => {
		const { weaponPopUpId } = btn.dataset;
		const { currentInstalledWeapons } = model.state.currentShipBuild;
		const currentWeaponSlot = model.uiState.currentWeaponSlot;
		let keepPopUpOpen = false;
		const updatedInstalledWeapons = currentInstalledWeapons.map(
			([slotId, currentWeapon]) => {
				// If weapon already exists in slot, remove it
				if (currentWeapon === weaponPopUpId) {
					keepPopUpOpen = !keepPopUpOpen;
					return [slotId, ""];
				}

				// if weapon dont match, keep the original
				if (slotId !== currentWeaponSlot.id) {
					return [slotId, currentWeapon];
				}

				// Otherwise, add the new weapon
				return [slotId, weaponPopUpId];
			}
		);

		model.state.currentShipBuild.currentInstalledWeapons =
			updatedInstalledWeapons;

		keepPopUpOpen !== false ? this.openPopUp() : this.closePopUp();
		HangarController.updateWeaponSprites();
	};

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
}
////
/////
// removeCurrentWeaponFromPopUpToTheShip(btn) {
// 	// if (!btn) return;
// 	const weaponButtonId = btn.dataset.id;
// 	const currentInstalledWeapons =
// 		model.state.currentShipBuild.currentInstalledWeapons;
// 	const weaponArray = model.uiState.weaponPopUp.currentWeaponArray;
// 	const fighterArray = model.uiState.fighterPopUp.currentFighterArray;
// 	const currentWeaponSlot = model.uiState.currentWeaponSlot;

// 	const newInstalledWeapons = currentInstalledWeapons.map(
// 		([slotId, currentWeapon]) =>
// 			slotId === currentWeaponSlot.id ? [slotId, ""] : [slotId, currentWeapon]
// 	);

// 	console.log(model.uiState.fighterPopUp);
// 	const isBtnFighter =
// 		fighterArray &&
// 		fighterArray.find((fighter) => fighter.id === weaponButtonId);
// 	// Assign weaponArray to pass into Render.
// 	const weaponArrayToPass = isBtnFighter ? fighterArray : weaponArray;

// 	builderLogic.removeCurrentWeaponAndFighterSlot("weapon");
// 	builderCenterView.renderComponent(
// 		builderCenterView.weaponPopUpTableContentRender(
// 			weaponArrayToPass,
// 			newInstalledWeapons,
// 			currentWeaponSlot.id
// 		)
// 	);

// 	//! bad implementation, but it works
// 	EventHandlers.removeEventListener(
// 		builderLogic.addCurrentWeaponFromPopUpToTheShip
// 	);
// 	EventHandlers.addEventListenerReturnDataSet(
// 		builderCenterView.weaponPopUpTableHandler(
// 			builderLogic.addCurrentWeaponFromPopUpToTheShip
// 		)
// 	);

// 	model.state.currentShipBuild.currentInstalledWeapons = newInstalledWeapons;
// }
