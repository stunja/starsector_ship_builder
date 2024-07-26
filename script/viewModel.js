"use strict";
import * as model from "./model.js";
import builderView from "./allViews/builderView.js";
import builderLeftView from "./allViews/builderLeftView.js";
import builderCenterView from "./allViews/builderCenterView.js";
import builderRightView from "./allViews/builderRightView.js";
import searchView from "./allViews/searchView.js";

let userInput = "";
const init = function () {
  builderView.render();
  searchView.render();
  searchView.addSearchHandler(findCreateDisplayCurrentShip);
};
const controllerHeart = () => {
  builderRightView.addVentsHandler(changeCurrentActiveCapacitors);
};
const findCreateDisplayCurrentShip = async function () {
  // Grab the value
  userInputCapture();
  // fetch data
  await fetchAndAssignData(userInput);
  // display the data
  builderLeftView.renderRow(model.state);
  builderCenterView.renderRow(model.state);
  builderRightView.render(model.state);
  controllerHeart();
};
const userInputCapture = () =>
  (userInput = searchView
    .getInputValue()
    .toLowerCase()
    .replace(/[^a-z]/g, ""));

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
const changeCurrentActiveCapacitors = () => {
  console.log("button was clicked");
  // if (model.state.currentShipBuild.activeCapacitors > 0)
  //   this.changeCurrentCapacitors(-1);
  // if (
  //   button.target.value === "shipCapacitorsPlus" &&
  //   currentShipBuild.activeCapacitors < currentShipBuild.maxCapacitors
  // )
  //   this.changeCurrentCapacitors(+1);
};
const ventsAndCapacitors = (button) => {
  if (!button) return;
  const { currentShipBuild } = this.model;

  if (
    button.target.value === "shipVentsPlus" &&
    currentShipBuild.activeVents < currentShipBuild.maxVents
  )
    this.changeCurrentVents(+1);
  if (
    button.target.value === "shipVentsMinus" &&
    currentShipBuild.activeVents > 0
  )
    this.changeCurrentVents(-1);
};

const changeCurrentCapacitors = (value) => {
  const { currentShipBuild } = this.model;
  // Elements means DOM element
  const activeCapacitorsElement = `.ship-capacitors__edit__value`;
  const currentFluxCapacityElement = `.flux-capacity__value`;
  const currentOrdinancePointsElement = `.ordinance-graph__points__current-points`;

  currentShipBuild.activeCapacitors += value;
  currentShipBuild.currentOrdinancePoints +=
    currentShipBuild.activeCapacitorsOrdinanceCost + value - 1;

  currentShipBuild.currentFluxCapacity =
    this.calculateCurrentFluxCapacity(currentShipBuild);

  this.view.updateText(
    activeCapacitorsElement,
    currentShipBuild.activeCapacitors
  );

  this.view.updateText(
    currentFluxCapacityElement,
    currentShipBuild.currentFluxCapacity
  );

  this.view.updateText(
    currentOrdinancePointsElement,
    currentShipBuild.currentOrdinancePoints
  );
};

const changeCurrentVents = (value) => {
  const { currentShipBuild } = this.model;
  // DOM
  const activeVentsElement = `.ship-vents__edit__value`;
  const currentFluxDissipationElement = `.ship-vents__flux-dissapation__value`;
  const currentOrdinancePointsElement = `.ordinance-graph__points__current-points`;

  currentShipBuild.activeVents += value;

  currentShipBuild.currentFluxDissapation =
    this.calculateCurrentFluxDissipation(currentShipBuild);

  currentShipBuild.currentOrdinancePoints +=
    currentShipBuild.activeVentsOrdinanceCost + value - 1;

  this.view.updateText(activeVentsElement, currentShipBuild.activeVents);
  this.view.updateText(
    currentFluxDissipationElement,
    currentShipBuild.currentFluxDissapation
  );
  this.view.updateText(
    currentOrdinancePointsElement,
    currentShipBuild.currentOrdinancePoints
  );
};

const calculateCurrentFluxCapacity = ({
  baseFluxCapacity,
  fluxCapacityPerSingleActiveCapacitor,
  activeCapacitors,
}) =>
  baseFluxCapacity + fluxCapacityPerSingleActiveCapacitor * activeCapacitors;

const calculateCurrentFluxDissipation = ({
  baseFluxDissipation,
  fluxDissipationPerSingleActiveVent,
  activeVents,
}) => baseFluxDissipation + fluxDissipationPerSingleActiveVent * activeVents;

// Start the program
init();
