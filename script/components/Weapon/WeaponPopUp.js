import ViewModel from "../../ViewModel.js";
import WeaponPopUpCreateCurrentWeaponArray from "./WeaponPopUpCreateCurrentWeaponArray.js";
// Helper
import classNames from "../../helper/DomClassNames.js";
import { weaponSlotIdIntoWeaponSlotObject } from "../../helper/helperFunction.js";
// Views
import WeaponPopUpContainerView from "../../allViews/WeaponPopUp/WeaponPopUpContainerView.js";
import WeaponPopUpTableHeaderView from "../../allViews/WeaponPopUp/WeaponPopUpTableHeaderView.js";
import WeaponPopUpTableView from "../../allViews/WeaponPopUp/WeaponPopUpTableView.js";
import WeaponSlots from "./WeaponSlots.js";

export default class WeaponPopUp extends ViewModel {
	#weaponSlot;
	constructor(model) {
		super(model);
	}
	update = (btn) => {
		if (!btn) return;
		const { weaponSlotId } = btn.dataset;

		this.#weaponSlot = weaponSlotIdIntoWeaponSlotObject(
			this.getUserShipBuild().weaponSlots,
			weaponSlotId
		);

		this.#weaponPopUpRender(this.#weaponSlot);
		this.#addWeaponPopUpEntryListener();
		this.#addWeaponPopUpTableHeaderListener();
	};
	//
	#openWeaponPop() {
		console.log("openWeaponPop");
	}
	#addWeaponClosePopUp() {
		// Update WeaponSlots // Render // Listener // Arcs / Background
		new WeaponSlots(this.getState()).update();
		// Remove WeaponPopUpContainer
		WeaponPopUpContainerView._clearRender();
	}
	//
	#addWeaponPopUpEntryListener() {
		const target = `.${classNames.tableEntries}`;
		WeaponPopUpTableView.addClickHandler(
			target,
			this.#addCurrentWeaponToInstalledWeapons
		);
	}
	#addWeaponPopUpTableHeaderListener() {
		const target = `.${classNames.tableHeaderEntry}`;
		WeaponPopUpTableHeaderView.addClickHandler(target, this.headerTest);
	}
	//! rework
	headerTest(btn) {
		const { category } = btn.dataset;
		console.log(category);
	}
	#weaponPopUpRender(weaponSlot) {
		// Renders After User Clicks on Weapon Button (Weapon Slot)

		const state = this.getState();
		const { allWeapons } = state.dataState;
		const { userShipBuild } = state.userState;

		const weaponArray = WeaponPopUpCreateCurrentWeaponArray.weaponFilterArray(
			weaponSlot,
			userShipBuild,
			allWeapons
		);

		//? Strange way to render, but it works.
		//? first draw "empty" container then target it with other renders
		WeaponPopUpContainerView.render(userShipBuild);
		WeaponPopUpTableHeaderView.render(userShipBuild);
		WeaponPopUpTableView.render([userShipBuild, weaponArray, weaponSlot]);
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
	#addCurrentWeaponToInstalledWeapons = (btn) => {
		const { weaponPopUpId } = btn.dataset;
		const userShipBuild = this.getUserShipBuild();
		const installedWeapons = userShipBuild.installedWeapons;
		let isWeaponPopUpOpen = this.getUiState().weaponPopUp.isWeaponPopUpOpen;
		//
		const updatedInstalledWeapons = installedWeapons.map(
			([slotId, currentWeapon]) => {
				// If weapon already exists in slot, remove it
				if (currentWeapon === weaponPopUpId) {
					isWeaponPopUpOpen = !isWeaponPopUpOpen;
					return [slotId, ""];
				}
				// if weapon dont match, keep the original
				if (slotId !== this.#weaponSlot.id) {
					return [slotId, currentWeapon];
				}
				// Otherwise, add the new weapon
				return [slotId, weaponPopUpId];
			}
		);

		this.setUpdateUserShipBuild({
			...userShipBuild,
			installedWeapons: updatedInstalledWeapons,
		});

		isWeaponPopUpOpen !== false
			? this.#openWeaponPop()
			: this.#addWeaponClosePopUp();

		//! Not working right now
		// this.setState("uiState", {
		// 	weaponPopUp: isWeaponPopUpOpen,
		// });

		// HangarController.updateWeaponSprites();
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
