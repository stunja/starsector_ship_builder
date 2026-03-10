import URL from "../helper/url";
import { jsonFetcher } from "./fetchers";
//? Ship Hulls Processing
// Ship ID corrections mapping
const SHIP_ID_CORRECTIONS = {
	crig: "constructionrig", // constructionrig / salvage_rig
	buffalo2: "buffalo_mk2", // buffalo_mk2 / buffalo_dd
	cerberus: "warhound",
};

const HULL_FIELDS_TO_EXTRACT = [
	"spriteName",
	"builtInMods",
	"weaponSlots",
	"builtInWings",
	"width",
	"height",
	"center",
	"viewOffset",
	"hullSize",
];

const HINTS_TO_FILTER = ["STATION", "SHIP_WITH_MODULES"];

const TAGS_TO_FILTER = ["restricted"];

const hasEngine = (ship) => Boolean(ship.maxBurn);
const hasUnwantedHint = (ship) =>
	HINTS_TO_FILTER.some((hint) => ship.hints.includes(hint));
const isRestricted = (ship) => ship.tags.includes(TAGS_TO_FILTER);

const listOfAllEditableShips = (shipList) =>
	shipList.filter(
		(ship) => hasEngine(ship) && !hasUnwantedHint(ship) && !isRestricted(ship),
	);

const fixMissingShipName = function (data) {
	// fix for salvage rig
	return data.map((obj) => {
		if (!obj.name)
			return {
				...obj,
				name: obj.designation,
			};
		return obj;
	});
};

const resolveShipId = (shipId) => SHIP_ID_CORRECTIONS[shipId] ?? shipId;
const fetchShipHullData = async (ship) => {
	const hullFilePath = `${URL.DATA_FOLDER.HULLS}/${resolveShipId(ship.id)}.ship`;

	try {
		const rawData = await jsonFetcher.fetch(hullFilePath);

		const additionalData = Object.fromEntries(
			Object.entries(rawData).filter(([key]) =>
				HULL_FIELDS_TO_EXTRACT.includes(key),
			),
		);

		return { ...ship, additionalData };
	} catch (err) {
		console.error(`Failed to fetch hull data for ship "${ship.id}":`, err);
		return { ...ship, additionalData: null }; // graceful fallback
	}
};

const injectHullSize = (data) => Promise.all(data.map(fetchShipHullData));

export const prepareShipHulls = async function (data) {
	const onlyShipHulls = listOfAllEditableShips(data);
	const hullsWithFixNaming = fixMissingShipName(onlyShipHulls);
	return injectHullSize(hullsWithFixNaming);
};
