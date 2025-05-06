// ViewModel
import ViewModel from "../ViewModel";

// Components
import { HULLMODS } from "../components/Hullmods/HullModData";
import HullModHelper from "../components/Hullmods/HullModHelper";

// Helper
import {
	findHullModKeyName,
	AddRemoveInstalledWeapon,
	weaponSlotIdIntoWeaponSlotObject,
	pushTargetWeaponObjectOnTop,
} from "../helper/helperFunction";
// helperFunction

//
export default class UpdateUserShipBuild extends ViewModel {
	#userShipBuild;
	#baseUserShipBuild;
	//
	#allWeapons;
	//
	constructor(model) {
		super(model);

		const currentState = this.getState();
		this.#userShipBuild = this.getUserShipBuild();
		this.#baseUserShipBuild = this._getBaseShipBuild();

		this.#allWeapons = currentState.dataState.allWeapons;
	}
	#update(currentUserShipBuild) {
		const shipBuildWithHullModEffects =
			this.#injectHullModEffects(currentUserShipBuild);

		const shipBuildWithWeaponCost = this.#injectWeaponsCost(
			shipBuildWithHullModEffects
		);
		console.log(shipBuildWithWeaponCost);
		this.setUpdateUserShipBuild({
			...shipBuildWithWeaponCost,
		});
	}

	updateHullMods(hullmodId, usableHullMods) {
		const userShipBuild = this.#userShipBuild;
		const newHullMods = HullModHelper.updateInstalledHullMod(
			hullmodId,
			userShipBuild,
			usableHullMods
		);

		const newUserShipBuild = {
			...userShipBuild,
			hullMods: newHullMods,
		};

		this.#update(newUserShipBuild);
	}
	updateWeapons(weaponPopUpId, weaponSlotId) {
		const userShipBuild = this.#userShipBuild;
		const updateInstalledWeapons = AddRemoveInstalledWeapon(
			userShipBuild.installedWeapons,
			weaponPopUpId,
			weaponSlotId
		);

		const newUserShipBuild = {
			...userShipBuild,
			installedWeapons: updateInstalledWeapons,
		};

		this.#update(newUserShipBuild);
	}
	#injectHullModEffects(currentUserShipBuild) {
		return this.#updateUserShipBuildWithHullModLogic(
			currentUserShipBuild,
			this.#baseUserShipBuild
		);
	}
	#injectWeaponsCost(userShipBuild) {
		const { installedWeapons, ordinancePoints } = userShipBuild;

		const updateOpCost = this.#updateOpCost(installedWeapons);

		const newUserShipBuild = {
			...userShipBuild,
			ordinancePoints: ordinancePoints + updateOpCost,
		};

		return newUserShipBuild;
	}

	#updateUserShipBuildWithHullModLogic(userShipBuild, baseUserShipBuild) {
		const { installedHullMods, builtInMods } = userShipBuild.hullMods;
		const { hullMods, installedWeapons, capacitors, vents } = userShipBuild;

		const newInstalledWeapons = this.#updateInstalledWeapons(
			installedHullMods,
			installedWeapons
		);

		// baseUserShipBuild to reset userShipBuild // to clean before implementing hullModEffects
		let currentShipBuild = {
			...baseUserShipBuild,
			hullMods,
			installedWeapons: newInstalledWeapons || installedWeapons,
			capacitors,
			vents,
		};

		// Apply each hull mod effect sequentially
		const allHullMods = [...builtInMods, ...installedHullMods];

		if (!allHullMods.length) {
			return currentShipBuild;
		}

		for (const hullMod of allHullMods) {
			const [hullModObject] = findHullModKeyName(HULLMODS, hullMod.id);

			if (!hullModObject) {
				console.warn(`Hull mod not found: ${hullMod.id}`);
				continue;
			}

			if (hullModObject.hullModLogic) {
				currentShipBuild = hullModObject.hullModLogic(
					currentShipBuild,
					hullMod
				);
			}
		}

		return currentShipBuild;
	}

	// remove duplicateIWS
	#updateInstalledWeapons(installedHullMods, installedWeapons) {
		const targetClass = "converted_hangar";
		// Converted Hangar
		const isHangarExpansionPresent = installedHullMods.some(
			({ id }) => id === targetClass
		);

		// exit if no additional installedWeapons are needed
		if (!isHangarExpansionPresent) {
			return installedWeapons.filter(
				([weaponSlotId, _weaponId]) =>
					weaponSlotId && !weaponSlotId.includes("IWS")
			);
		}
	}

	// Increase OP cost from Weapons and Fighter
	#updateOpCost(installedWeapon) {
		const weaponIdArray = installedWeapon
			.filter(([_, weaponId]) => weaponId)
			.map((pair) => pair[1]);

		const findOpValue = weaponIdArray.map((singleWeaponId) => {
			const { oPs } = this.#allWeapons.find(({ id }) => id === singleWeaponId);
			return oPs;
		});
		if (!findOpValue || findOpValue.length < 1) return 0;
		const sumArrayIntoASingleValue = findOpValue.reduce(
			(acc, crr) => acc + crr
		);
		return sumArrayIntoASingleValue;
	}
}
