import { renameKeysFromCSVdata } from "./helperFunction.js";

export const state = {
  allShips: [],
  allWeapons: [],
  allShipHulls: [],
  allFighters: [],
  currentShip: [],
  currentShipBuild: [],
};

const fetchAllShipData = async function () {
  try {
    const res = await fetch("./starsectorData/ship_data.csv");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const csvData = await res.text();

    const rows = csvData.split("\n");
    const headers = rows[0].split(",");

    state.allShips = rows.slice(1).map((row) => {
      //shipData
      const values = row.split(",");
      let obj = headers.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      // keys conversion
      obj = renameKeysFromCSVdata(obj);
      return obj;
    });
    // this.allShips(allShips);
    // console.log(allShips);
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error after logging it
  }
};

const fetchAllHullModsData = async function () {
  try {
    const res = await fetch("./starsectorData/hull_mods.csv");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const csvData = await res.text();

    const getHeader = function (data) {
      return csvData.split("\n")[0].split(",");
    };
    const header = getHeader(csvData);
    const rows = csvData.split(/(?<=png)/);
    const clearRow = rows.map((row) =>
      row
        .replace(/\r/g, "")
        .split("\n")
        .filter(
          (e) => e.trim() !== "" && !e.startsWith("#") && !/^[,]+$/.test(e)
        )
    );
    const returnBack = clearRow.slice(0, 1).map((e) => e[1]);
    const finalRow = clearRow.slice(1);
    finalRow.unshift(returnBack);

    const combinedString = finalRow.map((subArr) => {
      if (subArr.length === 0) return "";
      return subArr.reduce((acc, curr) => [acc + curr], "");
    });

    const values = combinedString.map(([row]) => {
      function replaceCommasInQuotes(str) {
        return str.replace(/"[^"]*"/g, function (match) {
          return match.replace(/,/g, " ");
        });
      }
      const edited = replaceCommasInQuotes(row);

      return edited.split(",");
    });
    state.allShipHulls = values.map((row) => {
      // const values = row.split(",");
      let obj = header.reduce((object, header, index) => {
        object[header] = row[index]; // Use bracket notation for dynamic property names
        return object;
      }, {});
      // keys conversion
      obj = renameKeysFromCSVdata(obj);
      return obj;
    });
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error after logging it
  }
};
export const fetchSpecializedShipData = async function () {
  const shipName = state.currentShip.id;
  try {
    const res = await fetch(`./starsectorData/hulls/${shipName}.ship`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const specificShipData = await res.text();
    const dataNormalized = JSON.parse(specificShipData);
    // Only grabs specific data, check .SHIP file for more positions
    const whatToExtract = [
      "spriteName",
      "builtInMods",
      "weaponSlots",
      "hullSize",
    ];
    Object.entries(dataNormalized).forEach(([key, value]) => {
      if (whatToExtract.includes(key)) {
        state.currentShip[key] = value;
      }
    });
  } catch (err) {
    console.log(err);
  }
};

export const addBuildInHullModsToCurrentShipBuild = async function () {
  const { builtInMods } = state.currentShip;
  const { allShipHulls } = state;

  const hullModsMap = new Map(allShipHulls.map((hull) => [hull.id, hull]));

  const buildInHullMods = builtInMods
    .map((modId) => hullModsMap.get(modId))
    .filter(Boolean); // Removes undefined entries in case of missing mods
  state.currentShipBuild = { hullMods: { buildInHullMods: buildInHullMods } };
};

export const findAndCreateCurrentShip = async function (inputShipName) {
  let { allShips } = state;
  [state.currentShip] = allShips.filter((ship) =>
    ship.id === inputShipName ? ship.id : ""
  );
};
export const assingInitialCurrentShipData = function () {
  const { currentShip, currentShipBuild } = state;

  setHullSizeProperties(currentShipBuild, currentShip.hullSize);
  Object.assign(currentShipBuild, {
    // Capacitors
    activeCapacitors: 0,
    activeCapacitorsOrdinanceCost: 1,
    baseFluxCapacity: Number(currentShip.max_flux),
    currentFluxCapacity: Number(currentShip.max_flux),
    fluxCapacityPerSingleActiveCapacitor: 200,
    // Vents
    activeVents: 0,
    activeVentsOrdinanceCost: 1,
    baseFluxDissipation: Number(currentShip.flux_dissipation),
    fluxDissipationPerSingleActiveVent: 10,
    currentFluxDissapation: Number(currentShip.flux_dissipation),
    //CR
    currentCR: 70,
    // Ordinance Points
    currentOrdinancePoints: 0,
    maxOrdinancePoints: Number(currentShip.ordnance_points),
    // Misc
    currentPilot: "",
  });
};

const setHullSizeProperties = (data, hullSize) => {
  //? hullSize in specific shipHull file don`t match hullSize cost in hullMods
  // import for hullMods cost calc
  const hullSizeProperties = {
    CAPITAL_SHIP: {
      hullModCost: "cost_capital",
      maxVents: 50,
      maxCapacitors: 50,
    },
    CRUISER: { hullModCost: "cost_cruiser", maxVents: 30, maxCapacitors: 30 },
    DESTROYER: { hullModCost: "cost_dest", maxVents: 20, maxCapacitors: 20 },
    FRIGATE: { hullModCost: "cost_frigate", maxVents: 10, maxCapacitors: 10 },
  };

  if (hullSize in hullSizeProperties) {
    Object.assign(data, hullSizeProperties[hullSize]);
  } else {
    console.warn(`Unknown hull size: ${hullSize}`);
  }
};

const init = async function () {
  await fetchAllShipData();
  await fetchAllHullModsData();
};
init();

//model.state.currentShip.builtInMods
// export const addBuildInHullModsToCurrentShipBuild = async function () {
//   const id = state.currentShip.builtInMods;
//   const buildInHullMods = id.flatMap((e) =>
//     state.allShipHulls.filter((entry) => (entry.id === e ? { entry } : ""))
//   );
//   state.currentShipBuild.hullMods = { buildInHullMods: buildInHullMods };
// };
