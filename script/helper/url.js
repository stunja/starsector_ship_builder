const SRC_BASE = `src/starsector_data`;
const DATA_FOLDER = {
	GRAPHICS: `${SRC_BASE}/graphics`,
	HULLS: `${SRC_BASE}/hulls`,
	WEAPONS: `${SRC_BASE}/weapons`,
	HULL_MODS: `${SRC_BASE}/hullmods`,
	STRINGS: `${SRC_BASE}/strings`,
};

const VARIANT_BASE = `${SRC_BASE}/variants`;
const VARIANTS = {
	FIGHTERS: `fighters`,
	REMNANT: `remnant`,
	DRONES: `drones`,
};

const SVC = {
	SHIP_DATA: `ship_data.csv`,
	WEAPON_DATA: `weapon_data.csv`,
	HULL_MODS: `hull_mods.csv`,
	DESCRIPTION: `descriptions.csv`,
	FIGHTER: `wing_data.csv`,
};

const UI_BASE = `${DATA_FOLDER.GRAPHICS}/ui`;
const UI = {
	ICONS: "icons",
};

// IIFE self referencing path constructor
export const URL = {
	DATA_FOLDER: DATA_FOLDER,
	SVC: {
		SHIP_DATA: `/${DATA_FOLDER.HULLS}/${SVC.SHIP_DATA}`,
		FIGHTER: `/${DATA_FOLDER.HULLS}/${SVC.FIGHTER}`,
		WEAPON_DATA: `/${DATA_FOLDER.WEAPONS}/${SVC.WEAPON_DATA}`,
		HULL_MODS: `/${DATA_FOLDER.HULL_MODS}/${SVC.HULL_MODS}`,
		DESCRIPTION: `/${DATA_FOLDER.STRINGS}/${SVC.DESCRIPTION}`,
	},
	VARIANTS: {
		FIGHTERS: `/${VARIANT_BASE}/${VARIANTS.FIGHTERS}`,
		REMNANT: `/${VARIANT_BASE}/${VARIANTS.REMNANT}`,
		DRONES: `/${VARIANT_BASE}/${VARIANTS.DRONES}`,
	},
	UI: {
		ICONS: `/${UI_BASE}/${UI.ICONS}/`,
	},
};

export default URL;
