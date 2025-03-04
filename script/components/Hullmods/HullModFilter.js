import { HULLMODS } from "./HullModData";

class HullModFilter {
	controller(hullModArray, userShipBuild) {
		return [
			...this.#filterBuildInHullMods(hullModArray, userShipBuild),
			...this.#filterHullMods(hullModArray, userShipBuild),
		];
	}
	#filterBuildInHullMods(hullModArray, userShipBuild) {
		return HULLMODS.BUILD_IN.filterReason(hullModArray, userShipBuild);
	}

	#filterHullMods(hullModArray, userShipBuild) {
		const shieldHullMods = {
			[HULLMODS.SHIELD.adaptiveshields.id]:
				HULLMODS.SHIELD.adaptiveshields.filterReason,

			[HULLMODS.SHIELD.advancedshieldemitter.id]:
				HULLMODS.SHIELD.advancedshieldemitter.filterReason,

			[HULLMODS.SHIELD.frontemitter.id]:
				HULLMODS.SHIELD.frontemitter.filterReason,

			[HULLMODS.SHIELD.frontshield.id]:
				HULLMODS.SHIELD.frontshield.filterReason,

			[HULLMODS.SHIELD.shield_shunt.id]:
				HULLMODS.SHIELD.shield_shunt.filterReason,

			[HULLMODS.SHIELD.stabilizedshieldemitter.id]:
				HULLMODS.SHIELD.stabilizedshieldemitter.filterReason,

			[HULLMODS.SHIELD.hardenedshieldemitter.id]:
				HULLMODS.SHIELD.hardenedshieldemitter.filterReason,

			[HULLMODS.SHIELD.extendedshieldemitter.id]:
				HULLMODS.SHIELD.extendedshieldemitter.filterReason,
		};

		const phaseHullMods = {
			[HULLMODS.PHASE.adaptive_coils.id]:
				HULLMODS.PHASE.adaptive_coils.filterReason,
			[HULLMODS.PHASE.phase_anchor.id]:
				HULLMODS.PHASE.phase_anchor.filterReason,
		};

		const weaponHullMods = {
			[HULLMODS.WEAPONS.ballistic_rangefinder.id]:
				HULLMODS.WEAPONS.ballistic_rangefinder.filterReason,

			[HULLMODS.WEAPONS.dedicated_targeting_core.id]:
				HULLMODS.WEAPONS.dedicated_targeting_core.filterReason,

			[HULLMODS.WEAPONS.targetingunit.id]:
				HULLMODS.WEAPONS.targetingunit.filterReason,

			[HULLMODS.WEAPONS.advancedoptics.id]:
				HULLMODS.WEAPONS.advancedoptics.filterReason,

			[HULLMODS.WEAPONS.high_scatter_amp.id]:
				HULLMODS.WEAPONS.high_scatter_amp.filterReason,
		};
		const engineHullMods = {
			[HULLMODS.ENGINE.safetyoverrides.id]:
				HULLMODS.ENGINE.safetyoverrides.filterReason,
		};
		const logisticsHullMods = {
			[HULLMODS.LOGISTICS.militarized_subsystems.id]:
				HULLMODS.LOGISTICS.militarized_subsystems.filterReason,

			[HULLMODS.LOGISTICS.converted_fighterbay.id]:
				HULLMODS.LOGISTICS.converted_fighterbay.filterReason,
		};

		const specialHullMods = {
			[HULLMODS.SPECIAL.neural_integrator.id]:
				HULLMODS.SPECIAL.neural_integrator.filterReason,
			[HULLMODS.SPECIAL.escort_package.id]:
				HULLMODS.SPECIAL.escort_package.filterReason,
		};

		const fighterHullMods = {
			[HULLMODS.FIGHTER.converted_hangar.id]:
				HULLMODS.FIGHTER.converted_hangar.filterReason,

			[HULLMODS.FIGHTER.defensive_targeting_array.id]:
				HULLMODS.FIGHTER.defensive_targeting_array.filterReason,

			[HULLMODS.FIGHTER.expanded_deck_crew.id]:
				HULLMODS.FIGHTER.expanded_deck_crew.filterReason,

			[HULLMODS.FIGHTER.recovery_shuttles.id]:
				HULLMODS.FIGHTER.recovery_shuttles.filterReason,
		};

		const allModifiers = {
			...shieldHullMods,
			...phaseHullMods,
			...weaponHullMods,
			...engineHullMods,
			...logisticsHullMods,
			...specialHullMods,
			...fighterHullMods,
		};

		return hullModArray
			.map((hullMod) => {
				// if finds modifier calls the function, if not return null
				const modifierFn = allModifiers[hullMod.id];
				return modifierFn ? modifierFn(hullMod, userShipBuild) : null;
			})
			.filter(Boolean); // remove undefined
	}

	filterDuplicateHullMods(greenArray, redArray) {
		if (!Array.isArray(redArray) || redArray.length < 1) return greenArray;

		return greenArray.filter((hullModObj) => {
			const duplicate = redArray.find((redObj) => hullModObj.id === redObj?.id);
			if (!duplicate) return hullModObj;
		});
	}
}
export default new HullModFilter();
