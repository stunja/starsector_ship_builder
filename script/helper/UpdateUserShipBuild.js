// ViewModel
import ViewModel from "../ViewModel";
import CapacitorsAndVents from "../components/ShipStats/CapacitorsAndVents";

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

		this.#userShipBuild = this.getUserShipBuild();
		this.#baseUserShipBuild = this._getBaseShipBuild();
	}
	#update(currentUserShipBuild) {
		const updateCapacitorsAndVents = this.#updateCapacitorsAndVents(
			currentUserShipBuild,
			this.#baseUserShipBuild
		);

		const shipBuildWithHullModEffects = this.#injectHullModEffects(
			updateCapacitorsAndVents
		);

		const shipBuildWithWeaponCost = this.#injectWeaponsCost(
			shipBuildWithHullModEffects
		);

		this.setUpdateUserShipBuild({
			...shipBuildWithWeaponCost,
		});
	}

	updateCapacitors(newCapacitors) {
		const newUserShipBuild = {
			...this.#userShipBuild,
			capacitors: newCapacitors,
		};

		this.#update(newUserShipBuild);
	}
	updateVents(newVents) {
		const newUserShipBuild = {
			...this.#userShipBuild,
			vents: newVents,
		};

		this.#update(newUserShipBuild);
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
	#updateCapacitorsAndVents(currentUserShipBuild, baseUserShipBuild) {
		const {
			fluxCapacityPerSingleActiveCapacitor,
			capacitors,
			capacitorsOrdinanceCost,
			vents,
			fluxDissipationPerSingleActiveVent,
		} = currentUserShipBuild;

		const {
			fluxCapacity: _baseFluxCapacity,
			fluxDissipation: _baseFluxDissipation,
			ordinancePoints: _baseOrdinancePoints,
		} = baseUserShipBuild;

		// Update Capacity
		const updateFluxCapacity =
			_baseFluxCapacity + fluxCapacityPerSingleActiveCapacitor * capacitors;

		// Update Dissipation
		const updateFluxDissipation =
			_baseFluxDissipation + fluxDissipationPerSingleActiveVent * vents;

		// Ordinance Cost
		const updateOrdinancePoints =
			_baseOrdinancePoints + (capacitors + vents) * capacitorsOrdinanceCost;

		const newUserShipBuild = {
			...currentUserShipBuild,
			ordinancePoints: updateOrdinancePoints,
			fluxCapacity: updateFluxCapacity,
			fluxDissipation: updateFluxDissipation,
		};

		return newUserShipBuild;
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

		return {
			...userShipBuild,
			ordinancePoints: ordinancePoints + updateOpCost,
		};
	}

	#updateUserShipBuildWithHullModLogic(userShipBuild) {
		const { installedHullMods, builtInMods } = userShipBuild.hullMods;

		// Apply each hull mod effect sequentially
		const allHullMods = [...builtInMods, ...installedHullMods];

		if (!allHullMods.length) {
			return userShipBuild;
		}

		for (const hullMod of allHullMods) {
			const [hullModObject] = findHullModKeyName(HULLMODS, hullMod.id);

			if (!hullModObject) {
				console.warn(`Hull mod not found: ${hullMod.id}`);
				continue;
			}

			if (hullModObject.hullModLogic) {
				userShipBuild = hullModObject.hullModLogic(userShipBuild, hullMod);
			}
		}

		return userShipBuild;
	}
	// #updateUserShipBuildWithHullModLogic(userShipBuild, baseUserShipBuild) {
	// 	const { installedHullMods, builtInMods } = userShipBuild.hullMods;
	// 	const { hullMods, installedWeapons, capacitors, vents } = userShipBuild;

	// 	const newInstalledWeapons = this.#updateInstalledWeapons(
	// 		installedHullMods,
	// 		installedWeapons
	// 	);

	// 	// baseUserShipBuild to reset userShipBuild // to clean before implementing hullModEffects
	// 	let currentShipBuild = {
	// 		...baseUserShipBuild,
	// 		hullMods,
	// 		installedWeapons: newInstalledWeapons || installedWeapons,
	// 		capacitors,
	// 		vents,
	// 	};

	// 	// Apply each hull mod effect sequentially
	// 	const allHullMods = [...builtInMods, ...installedHullMods];

	// 	if (!allHullMods.length) {
	// 		return currentShipBuild;
	// 	}

	// 	for (const hullMod of allHullMods) {
	// 		const [hullModObject] = findHullModKeyName(HULLMODS, hullMod.id);

	// 		if (!hullModObject) {
	// 			console.warn(`Hull mod not found: ${hullMod.id}`);
	// 			continue;
	// 		}

	// 		if (hullModObject.hullModLogic) {
	// 			currentShipBuild = hullModObject.hullModLogic(
	// 				currentShipBuild,
	// 				hullMod
	// 			);
	// 		}
	// 	}

	// 	return currentShipBuild;
	// }

	// remove duplicateIWS
	//! idiotic implementation
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
		const { allWeapons, allFighters } = this.getState().dataState;
		const weaponIdArray = installedWeapon
			.filter(([_, weaponId]) => weaponId)
			.map((pair) => pair[1]);

		const findOpValue = weaponIdArray.map((singleWeaponId) => {
			const { oPs, opCost } = [...allWeapons, ...allFighters].find(
				({ id }) => id === singleWeaponId
			);

			return oPs || opCost;
		});
		if (!findOpValue || findOpValue.length < 1) return 0;
		const sumArrayIntoASingleValue = findOpValue.reduce(
			(acc, crr) => acc + crr
		);
		return sumArrayIntoASingleValue;
	}
}
