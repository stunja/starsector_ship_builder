import WeaponPopUpView from "../../components/Weapons/WeaponPopUpView.js";
import WeaponPopUpHandlers from "../../eventHandlers/WeaponPopUpHandlers.js";
import builderView from "../../allViews/builderView.js";

import * as model from "../../model";
import classNames from "../../helper/DomClassNames.js";
import EventHandlers from "../../eventHandlers/EventHandlers";

import HangarController from "../HangarController.js";
import WeaponSlotsController from "./WeaponSlotsController.js";

class WeaponPopUpController {
	openPopUp() {
		this.#render();
		this.#assignHandlers();
	}
	closePopUp() {
		builderView.renderComponent(WeaponPopUpView.closePopUp());
		model.uiState.currentWeaponSlot = "";
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

	#render() {
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
			WeaponPopUpView.tableBodyRender(
				currentWeaponArray,
				currentInstalledWeapons,
				currentWeaponSlot
			)
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
export default new WeaponPopUpController();
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
