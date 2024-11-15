"use strict";
import * as model from "./model.js";
import builderView from "./allViews/builderView.js";
import builderLeftView from "./allViews/builderLeftView.js";
import builderCenterView from "./allViews/builderCenterView.js";
import builderRightView from "./allViews/builderRightView.js";
import searchView from "./allViews/searchView.js";
import builderPopUpView from "./allViews/builderPopUpView.js";
import { calculateHullModCost } from "./helperFunction.js";

const defaultRemSize = 10;
//? I can treat officer skills the same way as hullMod Effects

// const init = function () {
//   builderView.render();
//   searchView.render();
//   searchView.addSearchHandler(findCreateDisplayCurrentShip);
//   builderPopUpView.render(model.state);
// };
//!!! DEV
const init = async function () {
  try {
    await model.modelInit(); //! I need to use it in the future, to control the load
    //? correct order
    builderView.render();
    searchView.render();
    searchView.addSearchHandler(findCreateDisplayCurrentShip);
    //
    builderRender();
    //
    updateRighInfoSection();
    // check if ship is phased or shielded // render appropriate type
    openHullModMenuController();
    //
    builderLogic.controller();
  } catch (err) {
    console.log(err);
  }
};
const builderRender = function () {
  builderLeftView.renderRow(model.state);
  builderCenterView.render(model.state);
  builderRightView.render(model.state);
};
const updateRighInfoSection = function () {
  builderRightView.renderComponent(builderRightView.ordinancePointsRender());
  builderRightView.renderComponent(builderRightView.speedArmorHullRender());
  // capacitorController.assignFluxCapacity();
  capacitorRender();
  ventsRender();
  builderRightView.renderComponent(builderRightView.weaponFluxRender());
  shipShieldRenderBasedOnShipType();
};
const shipShieldRenderBasedOnShipType = function () {
  const { shipType } = model.state.currentShipBuild;
  if (shipType === "phaseShip") {
    builderRightView.renderComponent(builderRightView.phaseDataRender());
  } else {
    builderRightView.renderComponent(builderRightView.shieldDataRender());
  }
};
const capacitorRender = function () {
  builderRightView.removeEventListener(
    capacitorController.changeCurrentActiveCapacitors
  );
  builderRightView.renderComponent(builderRightView.shipCapacitorsRender());
  builderRightView.addEventListenerReturnDataSet(
    builderRightView.addCapacitorsHandler(
      capacitorController.changeCurrentActiveCapacitors
    )
  );
};
const ventsRender = function () {
  builderRightView.removeEventListener(ventController.changeCurrentActiveVents);
  builderRightView.renderComponent(
    builderRightView.ventsAndDissipationRender()
  );
  builderRightView.addEventListenerReturnDataSet(
    builderRightView.addVentsHandler(ventController.changeCurrentActiveVents)
  );
};
const openHullModMenuController = () => {
  // openHullModMenuHandler Handler Pair
  builderRightView.removeEventListener(hullModController.hullModsMenu);
  builderRightView.renderComponent(builderRightView.hullModMarkUp());
  builderRightView.renderComponent(builderRightView.buildInHullModRender());
  //
  // hullModController.hullModsMenuRegular();
  //
  builderRightView.addEventListenerReturnDataSet(
    builderRightView.openHullModMenuHandler(hullModController.hullModsMenu)
  );
};
const resetData = {
  // array to store keys names of properties that were changed (currentShipBuild)
  propertiesToReset: [],
  resetDataController() {
    if (resetData.propertiesToReset.length > 0) {
      // console.log(this.propertiesToReset);
      resetData.resetSelectedData();
      // Vents and Capacitors are back to base, then mult by number of active vents/cap (to return back to normal)
      capacitorController.fluxCapacityCalcBasedOnActiveCapacitors();
      ventController.ventDissipationCalcBasedOnActiveVents();
    }
  },
  resetSelectedData() {
    // replace current value with base value
    // simply by replacing the currentName with BaseName and assign value
    this.propertiesToReset.forEach((currentPropertyName) => {
      if (model.state.currentShipBuild[currentPropertyName]) {
        const basePropertyName = currentPropertyName.replace(
          "current",
          "_base"
        );

        model.state.currentShipBuild[currentPropertyName] =
          model.state.currentShipBuild[basePropertyName];
      }
    });
    // clear propertiesToReset array
    this.propertiesToReset = [];
  },
};
const builderLogic = {
  controller() {
    const baseWeaponSlots = model.state.currentShipBuild._baseWeaponSlots;

    builderLogic.shipBuilder(baseWeaponSlots);
  },
  // TODO
  //! Work Area
  shipBuilder(baseWeaponSlots) {
    builderCenterView.renderComponent(
      builderCenterView.weaponSlotRender(baseWeaponSlots)
    );
    builderCenterView.weaponSlotChangePosition(model.state);
    builderCenterView.weaponArcAndAngleChangeCoords();
    builderCenterView.shipSpriteUpdate();

    // click on slot, open table
    builderCenterView.removeEventListener(builderLogic.weaponButton);
    builderCenterView.addEventListenerReturnDataSet(
      builderCenterView.weaponButtonHandler(builderLogic.weaponButton)
    );
  },

  weaponPopUpHandlers() {
    // Table Head Handler
    builderCenterView.removeEventListener(builderLogic.weaponPopUpTableSorter);
    builderCenterView.addEventListenerReturnDataSet(
      builderCenterView.weaponPopUpHeaderHandler(
        builderLogic.weaponPopUpTableSorter
      )
    );

    // TODO (Add weapon to ship)
    builderCenterView.removeEventListener(
      builderLogic.addCurrentWeaponFromPopUpToTheShip
    );
    builderCenterView.addEventListenerReturnDataSet(
      builderCenterView.weaponPopUpTableHandler(
        builderLogic.addCurrentWeaponFromPopUpToTheShip
      )
    );
    // Table Hover Effect Handler
    builderCenterView.removeEventListener(
      builderLogic.showAdditionalInformationOnHover
    );
    builderCenterView.addEventListenerReturnDataSet(
      builderCenterView.weaponPopUpHoverEffect(
        builderLogic.showAdditionalInformationOnHover
      )
    );

    // Hide PopUp Handler
    builderCenterView.removeEventListener(builderLogic.weaponPopUpHide);
    builderCenterView.addEventListenerReturnDataSet(
      builderCenterView.weaponPopUpHideButtonHandler(
        builderLogic.weaponPopUpHide
      )
    );
  },
  weaponPopUpHide() {
    builderCenterView.weaponPopUpFormRemover();
  },
  weaponPopUpRender(
    currentWeaponArray,
    currentWeaponTypes,
    currentInstalledWeapons,
    currentWeaponSlot
  ) {
    builderCenterView.renderComponent(builderCenterView.weaponPopUpRender());

    builderCenterView.renderComponent(
      builderCenterView.weaponPopUpTableHeader()
    );
    builderCenterView.renderComponent(
      builderCenterView.weaponPopUpTableContentRender(
        currentWeaponArray,
        currentInstalledWeapons,
        currentWeaponSlot
      )
    );
    // Handlers
    builderCenterView.removeEventListener(
      builderLogic.removeCurrentWeaponFromPopUpToTheShip
    );
    builderCenterView.addEventListenerReturnDataSet(
      builderCenterView.weaponPopUpRemoveCurrentWeapon(
        builderLogic.removeCurrentWeaponFromPopUpToTheShip
      )
    );
  },
  weaponPopUpReRender(
    currentFilteredArray,
    currentInstalledWeapons,
    currentWeaponSlot,
    currentWeaponTypes
  ) {
    builderCenterView.renderComponent(builderCenterView.weaponPopUpRender());
    builderCenterView.renderComponent(
      builderCenterView.weaponPopUpFilterRender(currentWeaponTypes)
    );
    builderCenterView.renderComponent(
      builderCenterView.weaponPopUpTableHeader()
    );
    builderCenterView.renderComponent(
      builderCenterView.weaponPopUpTableContentRender(
        currentFilteredArray,
        currentInstalledWeapons,
        currentWeaponSlot
      )
    );
    // Handlers
    builderCenterView.removeEventListener(
      builderLogic.addCurrentWeaponFromPopUpToTheShip
    );
    builderCenterView.addEventListenerReturnDataSet(
      builderCenterView.weaponPopUpTableHandler(
        builderLogic.addCurrentWeaponFromPopUpToTheShip
      )
    );
    builderCenterView.removeEventListener(
      builderLogic.showAdditionalInformationOnHover
    );
    builderCenterView.addEventListenerReturnDataSet(
      builderCenterView.weaponPopUpHoverEffect(
        builderLogic.showAdditionalInformationOnHover
      )
    );
  },
  weaponButton(btn) {
    const { id } = btn.dataset;
    const { _baseWeaponSlots } = model.state.currentShipBuild;
    const { allWeapons } = model.state;

    const [currentWeaponSlot] = (model.uiState.weaponPopUp.currentWeaponSlot =
      _baseWeaponSlots.filter((slot) => slot.id === id));

    const generalFilter = (weaponArray, currentSlot) => {
      const SIZE = {
        LARGE: "LARGE",
        MEDIUM: "MEDIUM",
        SMALL: "SMALL",
      };
      const mountType = {
        BALLISTIC: "BALLISTIC",
        ENERGY: "ENERGY",
        MISSILE: "MISSILE",
        HYBRID: "HYBRID",
        COMPOSITE: "COMPOSITE",
        SYNERGY: "SYNERGY",
        UNIVERSAL: "UNIVERSAL",
      };

      const sizeFilter = {
        [SIZE.LARGE]: (wpn) =>
          wpn.additionalWeaponData.size === SIZE.LARGE ||
          wpn.additionalWeaponData.size === SIZE.MEDIUM,
        [SIZE.MEDIUM]: (wpn) =>
          wpn.additionalWeaponData.size === SIZE.MEDIUM ||
          (wpn.additionalWeaponData.size === SIZE.SMALL &&
            wpn.type === wpn.additionalWeaponData.mountTypeOverride),
        [SIZE.SMALL]: (wpn) => wpn.additionalWeaponData.size === SIZE.SMALL,
      };

      const typeFilter = {
        [mountType.BALLISTIC]: (wpn) =>
          wpn.additionalWeaponData.type === mountType.BALLISTIC,
        [mountType.ENERGY]: (wpn) =>
          wpn.additionalWeaponData.type === mountType.ENERGY,
        [mountType.MISSILE]: (wpn) =>
          wpn.additionalWeaponData.type === mountType.MISSILE,
        [mountType.HYBRID]: (wpn) =>
          wpn.additionalWeaponData.type === mountType.BALLISTIC ||
          wpn.additionalWeaponData.type === mountType.ENERGY ||
          wpn.additionalWeaponData.mountTypeOverride === mountType.HYBRID,
        [mountType.COMPOSITE]: (wpn) =>
          wpn.additionalWeaponData.type === mountType.BALLISTIC ||
          wpn.additionalWeaponData.type === mountType.MISSILE ||
          wpn.additionalWeaponData.mountTypeOverride === mountType.COMPOSITE,
        [mountType.SYNERGY]: (wpn) =>
          wpn.additionalWeaponData.type === mountType.ENERGY ||
          wpn.additionalWeaponData.type === mountType.MISSILE ||
          wpn.additionalWeaponData.mountTypeOverride === mountType.SYNERGY,
        [mountType.UNIVERSAL]: () => true,
      };
      const typeFilterArray = weaponArray.filter(
        typeFilter[currentSlot.type] ||
          (() => {
            console.error("Invalid slot TYPE");
            return false;
          })
      );
      const sizeFilterArray = typeFilterArray.filter(
        sizeFilter[currentSlot.size] ||
          (() => {
            console.error("Invalid slot SIZE");
            return false;
          })
      );

      return sizeFilterArray.sort(
        (a, b) => Number.parseInt(b.OPs) - Number.parseInt(a.OPs)
      );
    };

    const currentWeaponArray = (model.uiState.weaponPopUp.currentArrayState =
      generalFilter(allWeapons, currentWeaponSlot));
    const currentWeaponTypes = [
      ...new Set(currentWeaponArray.map((wpn) => wpn.type)),
    ];

    model.uiState.weaponPopUp.currentWeaponTypes = currentWeaponTypes;
    model.uiState.weaponPopUp.currentWeaponArray = currentWeaponArray;
    model.uiState.currentWeaponSlot = currentWeaponSlot;

    builderLogic.initWeaponPopUpRender(btn);
  },
  initWeaponPopUpRender(btn) {
    const { currentWeaponArray, currentWeaponTypes, currentWeaponSlot } =
      model.uiState.weaponPopUp;
    const { currentInstalledWeapons } = model.state.currentShipBuild;

    builderLogic.weaponPopUpRender(
      currentWeaponArray,
      currentWeaponTypes,
      currentInstalledWeapons,
      currentWeaponSlot
    );

    // update position and keep one weaponSlot active
    builderCenterView.weaponPopUpUpdatePos(btn);
    builderCenterView.weaponSlotActiveClass(btn);

    builderLogic.weaponPopUpHandlers();
    builderCenterView.weaponPopUpHideWhenClickOutsideHandler();
  },

  weaponPopUpTableSorter(btn) {
    const { category } = btn.dataset;
    const { currentArrayState, previousSortState } = model.uiState.weaponPopUp;
    const slotId = model.uiState.currentWeaponSlot.id;
    const { currentInstalledWeapons } = model.state.currentShipBuild;

    let { isAscending } = model.uiState.weaponPopUp;

    let currentWeaponArray = currentArrayState;
    // you need to click couple of times
    const sortToggleAscendDescent = (categoryToSort, sortType) => {
      return currentArrayState.toSorted((a, b) => {
        if (sortType === "text") {
          return isAscending
            ? a[categoryToSort].localeCompare(b[categoryToSort])
            : b[categoryToSort].localeCompare(a[categoryToSort]);
        } else if (sortType === "number") {
          return isAscending
            ? b[categoryToSort] - a[categoryToSort]
            : a[categoryToSort] - b[categoryToSort];
        }
      });
    };

    if (previousSortState !== category) isAscending = true;

    switch (category) {
      case "name":
        currentWeaponArray = sortToggleAscendDescent("name", "text");
        break;
      case "type":
        currentWeaponArray = sortToggleAscendDescent("type", "text");
        break;
      case "range":
        currentWeaponArray = sortToggleAscendDescent("range", "number");
        break;
      case "cost":
        currentWeaponArray = sortToggleAscendDescent("OPs", "number");
        break;
    }
    builderCenterView.renderComponent(
      builderCenterView.weaponPopUpTableContentRender(
        currentWeaponArray,
        currentInstalledWeapons,
        slotId
      )
    );

    model.uiState.weaponPopUp.isAscending = !isAscending;
    model.uiState.weaponPopUp.previousSortState = category;
  },

  addCurrentWeaponFromPopUpToTheShip(btn) {
    const { id } = btn.dataset;
    const { currentInstalledWeapons, currentWeaponSlots } =
      model.state.currentShipBuild;
    const { currentWeaponSlot } = model.uiState;

    model.state.currentShipBuild.currentInstalledWeapons =
      currentInstalledWeapons.map((wpn) => {
        if (wpn[0] === currentWeaponSlot.id) return [wpn[0], id];
        return wpn;
      });

    // hide the form
    builderLogic.replaceCurrentWeaponSprite(id);
    builderLogic.weaponPopUpHide();
  },
  removeCurrentWeaponFromPopUpToTheShip(btn) {
    const { id } = btn.dataset;
    const { currentInstalledWeapons } = model.state.currentShipBuild;
    const { currentWeaponArray } = model.uiState.weaponPopUp;
    const slotId = model.uiState.currentWeaponSlot.id;

    model.state.currentShipBuild.currentInstalledWeapons =
      currentInstalledWeapons.map((wpn) => {
        const isWeaponIdEqualToButtonDatasetId = wpn[1] === id;
        const isCurrentSlotIdEqualToIn = wpn[0] === slotId;

        if (isWeaponIdEqualToButtonDatasetId && isCurrentSlotIdEqualToIn)
          return [wpn[0], ""];
        return wpn;
      });

    builderLogic.removeCurrentWeaponSprite(id);
    builderCenterView.renderComponent(
      builderCenterView.weaponPopUpTableContentRender(
        currentWeaponArray,
        currentInstalledWeapons,
        slotId
      )
    );

    // bad implementation, but it works
    builderCenterView.removeEventListener(
      builderLogic.addCurrentWeaponFromPopUpToTheShip
    );
    builderCenterView.addEventListenerReturnDataSet(
      builderCenterView.weaponPopUpTableHandler(
        builderLogic.addCurrentWeaponFromPopUpToTheShip
      )
    );
  },
  showAdditionalInformationOnHover(btn) {
    const { id } = btn.dataset;
    if (model.uiState.weaponPopUp.currentWeaponHover !== id) {
      const { currentArrayState } = model.uiState.weaponPopUp;
      const [currentHoveredWeapon] = currentArrayState.filter(
        (weaponObj) => weaponObj.id === id
      );
      builderCenterView.renderComponent(
        builderCenterView.weaponPopUpHoverAdditionalInformationRender(
          currentHoveredWeapon
        )
      );
    }
    model.uiState.weaponPopUp.currentWeaponHover = id;
  },
  replaceCurrentWeaponSprite(id) {
    const {
      size: slotSize,
      type: slotType,
      id: slotId,
    } = model.uiState.currentWeaponSlot;

    const { allWeapons } = model.state;

    const [weaponObject] = allWeapons.filter((wpn) => wpn.id === id);

    builderCenterView.renderComponent(
      builderCenterView.addCurrentWeaponSpriteToShipRender(
        slotId,
        slotSize,
        slotType,
        weaponObject
      )
    );
    builderLogic.currentWeaponSpritePxIntoRemConversion(slotId);
  },
  currentWeaponSpritePxIntoRemConversion(weaponSlotId) {
    const localParent = `[data-id="${weaponSlotId}"]`;
    // TODO import class name from view
    const target = document.querySelector(`${localParent} .weapon-sprite`);
    const targetChildren = Array.from(target.children);

    const [base, gun] = targetChildren;
    const calc = (value) => value / defaultRemSize;

    if (base) {
      const baseHeight = base.height;
      const baseWidth = base.width;

      base.style.width = `${calc(baseWidth)}rem`;
      base.style.height = `${calc(baseHeight)}rem`;
    }

    if (gun) {
      const gunHeight = gun.height;
      const gunWidth = gun.width;

      gun.style.width = `${calc(gunWidth)}rem`;
      gun.style.height = `${calc(gunHeight)}rem`;
    }
  },
  removeCurrentWeaponSprite(id) {
    const weaponSlotId = model.uiState.currentWeaponSlot.id;

    builderCenterView.removeCurrentWeaponSpriteToShipRender(weaponSlotId);
    builderCenterView.renderComponent(
      builderCenterView.removeCurrentWeaponSpriteToShipRender(weaponSlotId)
    );
  },
  hullModLogic() {
    const { activeHullMods } = model.state.currentShipBuild.hullMods;
    const hullModEffectLibrary = model.hullModEffectData;
    // Idea that I have, is first default all values back to base
    // then apply new values.
    //
    resetData.resetDataController();
    const listOfAllModifiedCurrentShipBuildProperties =
      this.initAllActiveHullModsEffects(activeHullMods, hullModEffectLibrary);

    this.saveNamesOfChangedData(listOfAllModifiedCurrentShipBuildProperties);

    updateRighInfoSection();
    // guard close to prevent opening menu if state is closed
    if (model.uiState.hullModsMenu.menuState === "closed") return;

    // total update of hullModsMenu (filter / list / buttons etc)
    hullModController.hullModsMenuHandlersAndRender();
    //
  },

  saveNamesOfChangedData([data]) {
    if (!data) return;
    data.forEach((e) => {
      resetData.propertiesToReset.push(e);
    });
  },

  initAllActiveHullModsEffects(activeHullMods, hullModEffectLibrary) {
    return activeHullMods
      .map((hullMod) => {
        const camelCaseName = this.toCamelCase(hullMod.name);
        const matchingFunction = hullModEffectLibrary[camelCaseName];

        if (typeof matchingFunction === "function") {
          return matchingFunction();
        }

        return null; // or any default value you prefer if no matching function is found
      })
      .filter((result) => result !== null);
  },

  toCamelCase(str) {
    return str
      .replace(/-/g, "") // Remove all hyphens
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
        index === 0 ? letter.toLowerCase() : letter.toUpperCase()
      )
      .replace(/\s+/g, "");
  },
};
const hullModController = {
  popUpHullModMenuBehavior(btn) {
    if (!btn) return;
    builderPopUpView.filterArrayAccordingToSelectedFilterTag(btn);
    builderPopUpView.render(model.state);
    builderPopUpView.addRemoveHullModToggleButtonRender();

    //? Filter (Header)
    // popUpHullModMenuBehavior Handler Pair
    builderPopUpView.removeEventListener(
      hullModController.popUpHullModMenuBehavior
    );
    builderPopUpView.addEventListenerReturnDataSet(
      builderPopUpView.popUpFilterHandler(
        hullModController.popUpHullModMenuBehavior
      )
    );
    // Add Remove Hull Mod Handler Pair
    builderPopUpView.removeEventListener(hullModController.addRemoveHullMod);
    builderPopUpView.addEventListenerReturnDataSet(
      builderPopUpView.addHandlerToAddRemoveHullMod(
        hullModController.addRemoveHullMod
      )
    );
  },
  hullModsMenu(btn) {
    const { type } = btn.dataset;
    if (!type) return;
    if (type === "regular") {
      hullModController.hullModsMenuRegular(btn);
    }
    if (type === "smods") {
      hullModController.hullModsMenuSmods(btn);
    }
  },
  hullModsMenuRegular(btn) {
    //
    model.uiState.hullModsMenu.menuState === "closed"
      ? (model.uiState.hullModsMenu.menuState = "open")
      : (model.uiState.hullModsMenu.menuState = "closed");
    //
    if (model.uiState.hullModsMenu.menuState === "open") {
      // initializations
      if (btn) {
        btn.classList.add("hullmods__buttons__open-hullmod-menu--warn");
        btn.textContent = "Close Menu";
      }
      this.hullModsMenuHandlersAndRender();
    }
    if (model.uiState.hullModsMenu.menuState === "closed") {
      if (btn) {
        btn.classList.remove("hullmods__buttons__open-hullmod-menu--warn");
        btn.textContent = "Open HullMod Menu";
      }
      //! remove handler
      //! popupview reset the filter to ALL
      builderPopUpView.removeRender();
    }
  },
  hullModsMenuHandlersAndRender() {
    builderPopUpView.masterRender(model.state);

    // Pop Up Menu Handler
    builderPopUpView.removeEventListener(
      hullModController.popUpHullModMenuBehavior
    );
    builderPopUpView.addEventListenerReturnDataSet(
      builderPopUpView.popUpFilterHandler(
        hullModController.popUpHullModMenuBehavior
      )
    );

    // Add / Remove Buttons Handler
    builderPopUpView.removeEventListener(hullModController.addRemoveHullMod);
    builderPopUpView.addEventListenerReturnDataSet(
      builderPopUpView.addHandlerToAddRemoveHullMod(
        hullModController.addRemoveHullMod
      )
    );

    // Show More Description Btn Handler
    builderPopUpView.removeEventListener(
      hullModController.showMoreButtonToggle
    );
    builderPopUpView.addEventListenerReturnDataSet(
      builderPopUpView.showMoreHullModDescriptionHandler(
        hullModController.showMoreButtonToggle
      )
    );
    // Hide Description Btn Handler
    builderPopUpView.removeEventListener(
      hullModController.hideHullModDescription
    );
    builderPopUpView.addEventListenerReturnDataSet(
      builderPopUpView.hideHullModDescriptionHandler(
        hullModController.hideHullModDescription
      )
    );
    // Render
    builderPopUpView.addRemoveHullModToggleButtonRender();
  },
  hullModsMenuSmods() {
    console.log("smods");
  },
  addRemoveHullMod(btn) {
    if (!btn) return;

    const [activeHullMods, filteredHullMod, isHullModActive] =
      hullModController.addRemoveHullModFilterHelperFunction(btn);

    hullModController.addRemoveHullModToggle(
      activeHullMods,
      filteredHullMod,
      isHullModActive
    );
    // checks and renders change in button state. Fancy, as should check if menu closed or open.
    builderPopUpView.addRemoveHullModToggleButtonRender();
    //
    builderRightView.renderComponent(builderRightView.addNewHullModRender());
  },
  addRemoveHullModFilterHelperFunction(btn) {
    const state = {
      currentShipBuild: model.state.currentShipBuild,
      usableHullMods: model.state.usableHullMods,
    };

    if (!state.currentShipBuild.hullMods.activeHullMods) {
      state.currentShipBuild.hullMods.activeHullMods = [];
    }
    const { activeHullMods } = state.currentShipBuild.hullMods;
    const { id } = btn.dataset;
    const filteredHullMod = state.usableHullMods.find((e) => e.id === id);

    const isHullModActive = activeHullMods.some(
      (hullMod) => hullMod.id === filteredHullMod.id
    );
    return [activeHullMods, filteredHullMod, isHullModActive];
  },
  addRemoveHullModToggle(activeHullMods, filteredHullMod, isHullModActive) {
    if (!isHullModActive) {
      hullModController.addHullMod(filteredHullMod, activeHullMods);
    }
    if (isHullModActive) {
      hullModController.removeHullMod(filteredHullMod, activeHullMods);
    }
  },
  addHullMod(hullMod, activeHullMods) {
    activeHullMods.push(hullMod);
    ordinancePointsController.updateCurrentOrdinancePoints(
      calculateHullModCost(hullMod)
    );
    // Add new hull mod, and new controller for it, so you can remove it on the right side.
    builderRightView.removeEventListener(hullModController.addRemoveHullMod);
    builderRightView.addEventListenerReturnDataSet(
      builderRightView.addedRegularHullModsHandler(
        hullModController.addRemoveHullMod
      )
    );
    builderLogic.hullModLogic();
  },
  removeHullMod(hullMod, activeHullMods) {
    ordinancePointsController.updateCurrentOrdinancePoints(
      -calculateHullModCost(hullMod)
    );
    model.state.currentShipBuild.hullMods.activeHullMods =
      activeHullMods.filter((mod) => mod.id !== hullMod.id);

    builderLogic.hullModLogic();
  },
  showMoreButtonToggle(btn) {
    const { id } = btn.dataset;
    const target = document.querySelector(`#hullmod__${id} .hullmod__desc`);

    //
    const fullText = model.state.usableHullMods
      .map((hullMod) => (hullMod.id === id ? hullMod.desc : ""))
      .join("");

    target.innerHTML = `${fullText} <button class="hullmod__desc__close hullmod__desc__show-more" data-id="${id}">[Close]</button>`;
  },
  hideHullModDescription(btn) {
    const { id } = btn.dataset;
    const target = document.querySelector(`#hullmod__${id} .hullmod__desc`);
    const hullModDescription = model.state.usableHullMods
      .map((hullMod) => (hullMod.id === id ? hullMod.desc : ""))
      .join("");
    const fullText = builderPopUpView.hullModDescriptionShrink([
      hullModDescription,
      id,
    ]);

    target.innerHTML = `${fullText}`;
  },
};

const ordinancePointsController = {
  currentOrdinancePointsTextClass:
    builderRightView.ordinancePointsRenderTextClass,
  updateCurrentOrdinancePoints(value) {
    model.state.currentShipBuild.currentOrdinancePoints += value;
    builderRightView.renderComponent(builderRightView.ordinancePointsRender());
  },
};
const findCreateDisplayCurrentShip = async function () {
  // Grab the value
  //! Skipped
  const userInput = userInputCapture();
  // fetch data
  console.log(userInput);
  await fetchAndAssignData(userInput);
  // display the data
  // builderLeftView.renderRow(model.state);
  // builderCenterView.renderRow(model.state);
  // builderRightView.render(model.state);
  // builderRightView.renderHullModsSection(model.state);
  // everything rendered and ready
  controllerHeart();
};
const userInputCapture = () =>
  searchView
    .getInputValue()
    .toLowerCase()
    .replace(/[^a-z]/g, "");

const fetchAndAssignData = async function (shipName) {
  try {
    await model.findAndCreateCurrentShip(shipName);
    // Adds additional properties to object like weapon Slots info and shipSize etc.
    await model.fetchSpecializedShipData();
    await model.addBuildInHullModsToCurrentShipBuild();
    model.assingInitialCurrentShipData();
  } catch (err) {
    console.log(err);
  }
};

const capacitorController = {
  changeCurrentActiveCapacitors(btn) {
    const { buttonValue } = btn.dataset;
    const { activeCapacitors, maxCapacitors } = model.state.currentShipBuild;
    if (buttonValue < 0 && activeCapacitors > 0)
      capacitorController.changeCurrentCapacitors(-1);
    if (buttonValue > 0 && activeCapacitors < maxCapacitors)
      capacitorController.changeCurrentCapacitors(+1);
  },

  changeCurrentCapacitors(value) {
    const { currentShipBuild } = model.state;

    currentShipBuild.activeCapacitors += value;
    //
    ordinancePointsController.updateCurrentOrdinancePoints(
      currentShipBuild.activeCapacitorsOrdinanceCost + value - 1 // -1 because I give value in dataset -1 / +1
    );
    capacitorController.increaseDecreaseCurrentFluxCapacity(value);
    capacitorRender();
  },

  increaseDecreaseCurrentFluxCapacity(value = 0) {
    const { currentShipBuild } = model.state;
    const { currentFluxCapacity, currentFluxCapacityPerSingleActiveCapacitor } =
      currentShipBuild;

    if (value === -1) {
      model.state.currentShipBuild.currentFluxCapacity =
        currentFluxCapacity - currentFluxCapacityPerSingleActiveCapacitor;
    }
    if (value === 1) {
      model.state.currentShipBuild.currentFluxCapacity =
        currentFluxCapacity + currentFluxCapacityPerSingleActiveCapacitor;
    }
  },
  fluxCapacityCalcBasedOnActiveCapacitors() {
    // used for resetData function
    const {
      _baseFluxCapacity,
      activeCapacitors,
      currentFluxCapacityPerSingleActiveCapacitor,
    } = model.state.currentShipBuild;

    model.state.currentShipBuild.currentFluxCapacity =
      _baseFluxCapacity +
      activeCapacitors * currentFluxCapacityPerSingleActiveCapacitor;
  },
};
const ventController = {
  changeCurrentActiveVents(btn) {
    const { buttonValue } = btn.dataset;

    const { activeVents, maxVents } = model.state.currentShipBuild;
    if (buttonValue < 0 && activeVents > 0)
      ventController.changeCurrentVents(-1);
    if (buttonValue > 0 && activeVents < maxVents)
      ventController.changeCurrentVents(+1);
  },
  changeCurrentVents(value) {
    const { currentShipBuild } = model.state;

    currentShipBuild.activeVents += value;

    ordinancePointsController.updateCurrentOrdinancePoints(
      currentShipBuild.activeVentsOrdinanceCost + value - 1
    );
    ventController.increaseDecreaseCurrentFluxDissipation(value);
    ventsRender();
  },

  increaseDecreaseCurrentFluxDissipation(value = 0) {
    const {
      currentFluxDissipation,
      currentFluxDissipationPerSingleActiveVent,
    } = model.state.currentShipBuild;

    if (value === -1) {
      model.state.currentShipBuild.currentFluxDissipation =
        currentFluxDissipation - currentFluxDissipationPerSingleActiveVent;
    }
    if (value === 1) {
      model.state.currentShipBuild.currentFluxDissipation =
        currentFluxDissipation + currentFluxDissipationPerSingleActiveVent;
    }
  },
  ventDissipationCalcBasedOnActiveVents() {
    // used for resetData function
    const {
      _baseFluxDissipation,
      activeVents,
      currentFluxDissipationPerSingleActiveVent,
    } = model.state.currentShipBuild;

    model.state.currentShipBuild.currentFluxDissipation =
      _baseFluxDissipation +
      activeVents * currentFluxDissipationPerSingleActiveVent;
  },
};

// Start the program
init();
