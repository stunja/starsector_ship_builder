import * as model from "../../model.js";

import EventHandlers from "../../eventHandlers/EventHandlers.js";
import WeaponHandlers from "../../eventHandlers/WeaponHandlers.js";
import WeaponPopUpHandlers from "../../eventHandlers/WeaponPopUpHandlers.js";
import WeaponPopUpController from "./WeaponPopUpController.js";

class WeaponOpenPopUpMenu {
	addEventListener() {
		// click on slot, open table
		EventHandlers.removeEventListener(this.#weaponOpenPopUpMenu);
		EventHandlers.addEventListenerReturnDataSet(
			WeaponHandlers.weaponOpenPopUpMenuHandler(this.#weaponOpenPopUpMenu)
		);
	}
	#weaponOpenPopUpMenu(btn) {
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
		// this.#weaponSlotActiveClass(btn);
		WeaponPopUpController.openPopUp();
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
}
export default new WeaponOpenPopUpMenu();
