const classNames = {
	// Navigation
	nav: "nav",
	searchForm: "search-form",
	navLogo: "nav_logo",
	searchForm__Button: "search-form__button",
	// Generic
	dNone: "d-none",
	flexFlexEndGap: "flex-flexEnd-gap",
	button: "button",
	buttonCircle: "button-circle",
	dFlex: "d-flex",

	// Builder View
	buildMakerContainer: "build-maker-container",
	buildMaker: "build-maker",

	gridContainer: "grid-container",
	shipInfoContainer: "ship-info-container",
	additionalInfoContainer: "additional-info-container",
	builderButtonsContainer: "builder-buttons-container",
	shipAreaContainer: "ship-area-container",
	statsContainer: "stats-container",
	fighterContainer: "fighter-container",

	//

	// hoverAdditionalInformation: "hover-additional-information",
	unselectable: "unselectable",
	textBoldGeneric: "text-bold",
	smallImageBox: `small-image-box`,
	// Fighter Pop Up
	fighterPopUp: `fighter-pop-up`,
	fighterPopUpContainer: `fighter-pop-up__container`,
	// Fighter Container
	fighterSlotsContainer: "fighter-slots-container",
	fighterSlotsContainerHeader: "fighter-slots-container__header",
	fighterSlots: "fighter-slots",
	fighterSlot: "fighter-slot",
	fighterSlotEmpty: `fighter-slot__empty`,
	fighterSlotOrdinancePoints: `fighter-slot__ordinance-points`,
	fighterSlotContainer: `fighter-slot-container`, // Single Slot
	// Fighter Classes
	fighterFlexColumn: "fighter-flex-column",
	fighterSpriteContainer: `fighter-sprite-container`,
	fighterSpriteCost: `fighter-sprite-cost`,

	fighter: "fighter",
	fighterName: "fighter__name",
	fighterIcon: "fighter__icon",
	fighterSprite: "fighter__sprite",
	fighterRange: "fighter__range",
	fighterCost: "fighter__cost",
	fighterWingSize: "fighter__wing-size",
	fighterType: "fighter__type",
	fighterSize: "fighter__size",
	fighterOpacity: "fighter__opacity",

	fighterSprites: "fighter__sprites",
	fighterSpritesMax: "fighter__sprites-max",

	// Weapon Classes
	weaponDivider: "weapon-divider",
	weaponDescription: "weapon-desc",
	// weaponPopUpFilter: "weapon-filter",
	weaponPopUpActive: "weapon--active",
	weaponContentGroup: "weapon-content-group",

	weaponSpriteParent: "weapon-sprite-parent",

	// Weapon Hover Additional Information
	// Weapon Pop Up
	// weaponPopUp: "weapon-pop-up",
	// weaponPopUpParent: "weapon-pop-up-parent",
	// weaponPopUpTable: "weapon-pop-up__table",

	// Weapon Pop Up Table
	// weaponPopUpTableWrapper: "weapon-pop-up__table-wrapper",
	// weaponPopUpTableBody: "weapon-pop-up__table-body",
	weaponPopUpTableHeader: `weapon-pop-up__theader`,
	tableHeader: `theader-element`,
	//
	// weapon sprite
	weaponSpriteGun: "weapon-sprite--gun",
	weaponSpriteBase: "weapon-sprite--base",

	//
	weaponMountType: "weapon-mount-type",
	weaponMountTypeContent: "weapon-mount-type__content",
	weaponDamageType: "weapon-damage-type",

	// DOM classes
	shipSprite: "ship-sprite",
	currentShipSprite: "current-ship-sprite",
	shipAndWeaponsHolder: "ship-weapons-slots__holder",
	weaponSlotsHolder: "weapon-slots__holder",
	weaponSlots: "weapon-slots",
	weaponSlot: "weapon-slot",
	weaponSlotType: "weapon-slot-type",

	// #weaponSlotIcon = "";
	//
	weaponType: "weapon__type",
	weaponSize: "weapon__size",
	weaponOpacity: "weapon__opacity",

	weaponBackgroundSpriteParent: "weapon-background-sprite-parent",
	weaponBackgroundSprite: "weapon-background-sprite",
	weaponBackgroundSpriteType: "weapon-background-sprite__type",
	weaponBackgroundSpriteSize: "weapon-background-sprite__size",
	weaponBackgroundSpriteOppacity: "weapon-background-sprite__opacity",
	//
	weaponSprite: "weapon-sprite",

	// Filter
	weaponPopUpFilterButton: "weapon-filter__button",
	weaponPopUpFilterHideButton: "weapon-filter__button--hide",
	weaponPopUpFilterButtons: "weapon-filter__buttons",

	// Weapon Element
	weapon: "weapon",
	weaponName: "weapon__name",
	weaponIcon: "weapon__icon",
	weaponRange: "weapon__range",
	weaponCost: "weapon__cost",

	// general
	textAlignRight: "text-align-right",

	// weapon sprite
	weaponArc: "weapon-arc",
	weaponArcSprite: "weapon-arc__sprite",
	//
	fighterSlotActive: "fighter-slot--active",
	/////
	//! 24 Dec
	weaponPopUp: "weapon-pop-up",
	// Hover Container
	hoverContainer: "hover-container",
	weaponPrimaryData: "weapon-primary-data",
	// Table Container
	tableContainer: "table-container",
	tableBody: "table-body",

	// tableContainerBody: "table-container__body",
	tableFilter: "table-filter",
	tableHeader: "table-header",
	tableHeaderEntry: "table-header-entry",
	tableEntries: "table-entries",
	tableEntry: "table-entry",
	tableEntryAvailable: "table-entry--available",
	tableEntryUnavailable: "table-entry--unavailable",

	tableIcon: "table__icon",
	tableName: "table__name",
	tableDesc: "table__desc",
	tableType: "table__type",
	tableInstalledIcon: "table__installed-icon",
	// tableRange: "table__range",
	// tableCost: "table__cost",
	// HullMod Filter
	filterHeader: "filter-header",
	filterButtons: "filter-buttons",
	filterButton: "filter-button",

	//! Cancer
	//! I need to simplify all of this
	topContentGroup: "top-content-group",
	// Ordinance Points
	ordinancePointsGraph: "ordinance-graph",
	ordinanceGraphTitle: "ordinance-graph__title",
	ordinancePointsRenderTextClass: "ordinance-graph__points__current-points",
	ordinanceGraphBody: "ordinance-graph__body",
	ordinanceGraphPoints: "ordinance-graph__points",
	ordinanceGraphPointsMaxPoints: "ordinance-graph__points__max-points",

	// Speed Armor Hull

	speedArmorHullContainer: "speed-armor-hull-container",
	speedArmorHull__Speed: "speed-armor-hull__speed",
	speedArmorHull__Armor: "speed-armor-hull__armor",
	speedArmorHull__ArmorTitle: "speed-armor-hull__armor-title",
	speedArmorHull__ArmorValue: "speed-armor-hull__armor-value",
	speedArmorHull__Hull: "speed-armor-hull__hull",

	// Ship Capacitors
	shipCapacitorsContainer: "ship-capacitors-container",
	shipCapacitors__Edit: "ship-capacitors__edit",
	shipCapacitors__Button: "ship-capacitors__button",
	shipCapacitors__EditTitle: "ship-capacitors__edit__title",
	shipCapacitors__EditMinus: "ship-capacitors__edit--minus",
	shipCapacitors__EditPlus: "ship-capacitors__edit--plus",
	shipCapacitors__Edit__Value: "ship-capacitors__edit__value",
	shipCapacitors__FluxCapacity: "ship-capacitors__flux-capacity",
	fluxCapacity__Title: "flux-capacity__title",
	fluxCapacity__Value: "flux-capacity__value",
	shipCapacitors__Button: "ship-capacitors__button",
	shipCapacitors: "ship-capacitors",

	// Vents and Dissipation
	shipVents: "ship-vents",
	shipVents__Edit: "ship-vents__edit",
	shipVents__Edit__Value: "ship-vents__edit__value",
	shipVents__EditMinus: "ship-vents__edit--minus",
	shipVents__EditPlus: "ship-vents__edit--plus",
	shipVents__Button: "ship-vents__button",

	// Dissipation
	shipVents__FluxDissipation: "ship-vents__flux-dissipation",
	shipVents__FluxDissipation__Value: "ship-vents__flux-dissipation__value",

	// Weapon Flux
	weaponFlux: "weaponFlux",

	// Phase or Shield
	phaseOrShieldContainer: "phase-shield-container",
	// Phase Data
	phaseFlux: "cloak-flux",
	phaseFlux__PerSec: "cloak-flux__per-sec",
	phaseFlux__Activation: "cloak-flux__activation",

	// Shield Dat
	shieldFlux: "shield-flux",
	shieldFlux__PerSec: "shield-flux__per-sec",
	shieldFlux__PerDmg: "shield-flux__per-dmg",
	shieldArc: "shield_arc",

	// HullMods
	hullModsPopUp: "hullmods-pop-up",
	hullMods: "hullmods",
	hullMods__header: "hullmods__header",
	hullMods__container: "hullmods__container",
	hullMods__buttons: "hullmods__buttons",
	hullMods__button: "hullmods__button--open",
	// BuildIn HullMods
	buildInHullmods: "build-in-hullmods",
	buildInHullModsContainer: "build-in-hullmods__container",
	hullMod: "hullmod",
	hullModCost: "hullMod__cost",
	hullModDescValues: "hullMod__desc--value",
	removeInstalledHullModButton: "remove-installed-hullmod-button",

	// Added Hull Mods
	installedHullMods: "installed-hullmods",
	// addedHullMods__hullmod: "added-hullmods__hullmod",
	// addedHullMods__RemoveButton: "added-hullmod__remove-button",

	// Builder Buttons Section
	builderButton: "builder-button",
	// HullMod Filter
	hullModsFilterActive: "hullMods__filter--active",

	// Ship Name
	// ship-info-container (target)
	shipInfoTitle: "ship-info__title",
	shipInfoDetails: "ship-info__details",

	// Spinner
	spinner: "spinner",
	tableSpinner: "table-spinner",
};

export default classNames;
