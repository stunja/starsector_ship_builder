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
	isWeaponPopUpStateOpen(keepOpen = false) {
		const weaponPopUp = this.getUiState().weaponPopUp;

		this.setUpdateWeaponPopUpState({
			...weaponPopUp,
			isWeaponPopUpOpen: keepOpen,
		});
	}
}
