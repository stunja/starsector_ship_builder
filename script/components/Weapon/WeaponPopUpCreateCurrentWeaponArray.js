const SIZE = {
	LARGE: "LARGE",
	MEDIUM: "MEDIUM",
	SMALL: "SMALL",
};
const MOUNT_TYPE = {
	BALLISTIC: "BALLISTIC",
	ENERGY: "ENERGY",
	MISSILE: "MISSILE",
	HYBRID: "HYBRID",
	COMPOSITE: "COMPOSITE",
	SYNERGY: "SYNERGY",
	UNIVERSAL: "UNIVERSAL",
};

class WeaponPopUpCreateCurrentWeaponArray {
	// Main function
	weaponFilterArray(weaponSlot, allWeaponsObjects) {
		const filteredWeapons = this.#filterWeapons(allWeaponsObjects, weaponSlot);
		return filteredWeapons;
	}
	// There is 3 sizes and 7 types of weapons.
	// There are special rules what is allowed where.
	// TLDR Size is allowed L-[3,2], M-[2,1], S-[1].
	// Types are special, and you need to check rules. I took them from WIKIA, could be wrong??
	//! what does weapon.type === mountTypeOverride do?
	#FILTER_DEFINITIONS = {
		size: {
			[SIZE.LARGE]: (weapon) => {
				const { size } = weapon.additionalData;
				return size === SIZE.LARGE || size === SIZE.MEDIUM;
			},
			[SIZE.MEDIUM]: (weapon) => {
				const { size, mountTypeOverride } = weapon.additionalData;
				return (
					size === SIZE.MEDIUM ||
					size === SIZE.SMALL ||
					weapon.type === mountTypeOverride
				);
			},
			[SIZE.SMALL]: (weapon) => weapon.additionalData.size === SIZE.SMALL,
		},
		type: {
			[MOUNT_TYPE.BALLISTIC]: (weapon) =>
				weapon.additionalData.type === MOUNT_TYPE.BALLISTIC,
			[MOUNT_TYPE.ENERGY]: (weapon) =>
				weapon.additionalData.type === MOUNT_TYPE.ENERGY,
			[MOUNT_TYPE.MISSILE]: (weapon) =>
				weapon.additionalData.type === MOUNT_TYPE.MISSILE,
			[MOUNT_TYPE.HYBRID]: (weapon) => {
				const { type, mountTypeOverride } = weapon.additionalData;
				return (
					type === MOUNT_TYPE.BALLISTIC ||
					type === MOUNT_TYPE.ENERGY ||
					mountTypeOverride === MOUNT_TYPE.HYBRID
				);
			},
			[MOUNT_TYPE.COMPOSITE]: (weapon) => {
				const { type, mountTypeOverride } = weapon.additionalData;
				return (
					type === MOUNT_TYPE.BALLISTIC ||
					type === MOUNT_TYPE.MISSILE ||
					mountTypeOverride === MOUNT_TYPE.COMPOSITE
				);
			},
			[MOUNT_TYPE.SYNERGY]: (weapon) => {
				const { type, mountTypeOverride } = weapon.additionalData;
				return (
					type === MOUNT_TYPE.ENERGY ||
					type === MOUNT_TYPE.MISSILE ||
					mountTypeOverride === MOUNT_TYPE.SYNERGY
				);
			},
			[MOUNT_TYPE.UNIVERSAL]: () => true,
		},
	};
	//HELPER
	#createFilterWithFallback = (filterType, slotProperty, errorMessage) => {
		return (
			this.#FILTER_DEFINITIONS[filterType][slotProperty] ||
			(() => {
				console.error(errorMessage);
				return false;
			})
		);
	};
	// Sort by Cost, so initial state is nicely grouped like in-game by ordinance cost
	#sortByOPs = (a, b) => Number.parseInt(b.oPs) - Number.parseInt(a.oPs);

	// Filter first by Type than by Size => Sort and return
	#filterWeapons = (weapons, slot) => {
		const typeFilter = this.#createFilterWithFallback(
			"type",
			slot.type,
			"Invalid slot TYPE"
		);
		const sizeFilter = this.#createFilterWithFallback(
			"size",
			slot.size,
			"Invalid slot SIZE"
		);
		return weapons.filter(typeFilter).filter(sizeFilter).sort(this.#sortByOPs);
	};
}
export default new WeaponPopUpCreateCurrentWeaponArray();
