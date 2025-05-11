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
	#resetUserShipBuild(currentUserShipBuild) {
		const { installedWeapons, hullMods, capacitors, vents } =
			currentUserShipBuild;

		return {
			...this.#baseUserShipBuild,
			installedWeapons,
			hullMods,
			capacitors,
			vents,
		};
	}
	#update(currentUserShipBuild) {
		const resetMostProperties = this.#resetUserShipBuild(currentUserShipBuild);
		const updateCapacitorsAndVents = this.#updateCapacitorsAndVents(
			resetMostProperties,
			this.#baseUserShipBuild
		);

		const shipBuildWithHullModEffects = this.#injectHullModEffects(
			updateCapacitorsAndVents,
			this.#baseUserShipBuild
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
	#injectWeaponsCost(userShipBuild) {
		const { installedWeapons, ordinancePoints } = userShipBuild;

		const updateOpCost = this.#updateOpCost(installedWeapons);

		return {
			...userShipBuild,
			ordinancePoints: ordinancePoints + updateOpCost,
		};
	}

	#injectHullModEffects(userShipBuild, baseUserShipBuild) {
		const { installedWeapons } = userShipBuild;
		const { installedHullMods, builtInMods } = userShipBuild.hullMods;
		const { weaponSlots: baseWeaponSlots } = baseUserShipBuild;

		let currentUserShipBuild = this.#updateInstalledWeaponsAndSlots(
			installedHullMods,
			installedWeapons,
			userShipBuild,
			baseWeaponSlots
		);

		// Apply each hull mod effect sequentially
		const allHullMods = [...builtInMods, ...installedHullMods];

		if (!allHullMods.length) {
			return currentUserShipBuild;
		}

		for (const hullMod of allHullMods) {
			const [hullModObject] = findHullModKeyName(HULLMODS, hullMod.id);

			if (!hullModObject) {
				console.warn(`Hull mod not found: ${hullMod.id}`);
				continue;
			}

			if (hullModObject.hullModLogic) {
				currentUserShipBuild = hullModObject.hullModLogic(
					currentUserShipBuild,
					hullMod
				);
			}
		}
		return currentUserShipBuild;
	}

	// remove duplicateIWS
	#updateInstalledWeaponsAndSlots(
		installedHullMods,
		installedWeapons,
		userShipBuild,
		baseWeaponSlots
	) {
		const targetClass = "converted_hangar";
		// Converted Hangar
		const isHangarExpansionPresent = installedHullMods.some(
			({ id }) => id === targetClass
		);

		// exit if no additional installedWeapons are needed
		if (!isHangarExpansionPresent) {
			const updateInstalledWeapons = installedWeapons.filter(
				([weaponSlotId, _weaponId]) =>
					weaponSlotId && !weaponSlotId.includes("IWS")
			);
			return {
				...userShipBuild,
				installedWeapons: updateInstalledWeapons,
				weaponSlots: baseWeaponSlots,
			};
		}

		return {
			...userShipBuild,
			weaponSlots: baseWeaponSlots,
		};
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
