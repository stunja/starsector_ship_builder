"use strict";

import { HULLMODS } from "./components/Hullmods/HullModData";

export default class ViewModel {
	#model;
	constructor(model) {
		this.#model = model;
	}
	setState(data) {
		this.#model.updateState(data);
	}
	setUpdateUserShipBuild(data) {
		this.#model.updateUserShipBuild(data);
	}
	//
	setUpdateWeaponPopUpState(data) {
		this.#model.updateWeaponPopUpState(data);
	}
	// All the functions are overkill
	getState() {
		return this.#model;
	}
	// User State
	getUserState() {
		return this.#model.userState;
	}
	getUserShipBuild() {
		return this.#model.userState.userShipBuild;
	}
	_getBaseShipBuild() {
		return this.#model.userState._baseShipBuild;
	}
	getCurrentShip() {
		return this.#model.userState._currentShip;
	}
	getUsableHullMods() {
		return this.#model.userState.usableHullMods;
	}
	// get Data State
	getDataState() {
		return this.#model.dataState;
	}
	// get UI State
	getUiState() {
		return this.#model.uiState;
	}

	// General Functions
	isWeaponPopUpStateOpen(isOpen = false) {
		const weaponPopUp = this.getUiState().weaponPopUp;

		this.setUpdateWeaponPopUpState({
			...weaponPopUp,
			isWeaponPopUpOpen: isOpen,
		});
	}

	// updateUserShipBuildWithHullModLogic() {
	// 	const userShipBuild = this.getUserShipBuild();
	// 	const baseUserShipBuild = this._getBaseShipBuild();

	// 	const { installedHullMods, builtInMods } = userShipBuild.hullMods;
	// 	const { hullMods, installedWeapons, capacitors, vents } = userShipBuild;
	// 	console.log(userShipBuild.hullMods);
	// 	// baseUserShipBuild to reset userShipBuild // to clean before implementing hullModEffects
	// 	const resetUserShipBuild = {
	// 		...baseUserShipBuild,
	// 		hullMods,
	// 		installedWeapons,
	// 		capacitors,
	// 		vents,
	// 	};
	// 	console.log("test");
	// 	const updateShipBuild = () => {
	// 		let currentShipBuild = resetUserShipBuild;
	// 		const userShipBuildWithActiveHullModEffect = [
	// 			...installedHullMods,
	// 			...builtInMods,
	// 		]
	// 			?.map((hullMod) => {
	// 				const [hullModObject] = this.findHullModKeyName(HULLMODS, hullMod.id);

	// 				if (!hullModObject) {
	// 					console.warn(`Hull mod not found: ${hullMod.id}`);
	// 					return null;
	// 				}

	// 				if (hullModObject.hullModLogic) {
	// 					return (currentShipBuild = hullModObject.hullModLogic(
	// 						currentShipBuild,
	// 						hullMod
	// 					));
	// 				}

	// 				return null;
	// 			})
	// 			.filter(Boolean);

	// 		return userShipBuildWithActiveHullModEffect;
	// 	};
	// 	// Reset UserShipBuild
	// 	if (updateShipBuild().length < 1) {
	// 		this.setUpdateUserShipBuild({ ...resetUserShipBuild });
	// 		return;
	// 	}
	// 	this.setUpdateUserShipBuild({
	// 		...updateShipBuild().at(-1),
	// 	});
	// }

	// findHullModKeyName(obj, searchKey, matches = []) {
	// 	// Early return if obj is null or not an object
	// 	if (!obj || typeof obj !== "object") return matches;

	// 	// Direct key match
	// 	if (obj[searchKey] !== undefined) {
	// 		matches.push(obj[searchKey]);
	// 	}

	// 	// Recursive search through object properties
	// 	for (const key in obj) {
	// 		if (obj.hasOwnProperty(key) && typeof obj[key] === "object") {
	// 			this.findHullModKeyName(obj[key], searchKey, matches);
	// 		}
	// 	}

	// 	return matches;
	// }
}
