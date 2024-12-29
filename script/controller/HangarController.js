import classNames from "../helper/DomClassNames";
import builderView from "../allViews/builderView.js";
import HangarContainerView from "../components/Weapons/HangarContainerView.js";

import WeaponSlotsController from "./Weapon/WeaponSlotsController.js";
import WeaponOpenPopUpMenu from "./Weapon/WeaponOpenPopUpMenu.js";
// Model
import * as model from "../model.js";
import WeaponPopUpController from "./Weapon/WeaponPopUpController.js";

const TARGET_REM = 10; // rem for shipSpriteSize / WeaponSlotsPosition / shipGAP

class HangarController {
	init() {
		this.#containerRender();

		WeaponSlotsController.init();
		WeaponOpenPopUpMenu.addEventListener();
	}
	#containerRender() {
		builderView.renderComponent(HangarContainerView.render(model.state));

		this.#shipSpriteUpdate();
	}
	updateWeaponSprites() {
		WeaponSlotsController.init();
		WeaponSlotsController.renderWeaponSpritesFromInstalledWeapons();
	}

	#shipSpriteUpdate() {
		const { currentShip, currentShipBuild } = model.state;
		const targetElement = document.querySelector(`.${classNames.shipSprite}`);
		const className = "currentShipSprite";
		//
		const spriteHeight = currentShip.height;
		const spriteWidth = currentShip.width;
		// const spriteOffset = currentShip.viewOffset;
		const spriteWidthRem = spriteWidth / TARGET_REM;
		const spriteHeightRem = spriteHeight / TARGET_REM;

		const createNewStyle = () => {
			// Create a new style element
			const styleSheet = document.createElement("style");
			styleSheet.type = "text/css";

			// Append the style element to the document head
			document.head.appendChild(styleSheet);

			// Insert a CSS rule into the new stylesheet
			styleSheet.sheet.insertRule(
				`.${className} { width:${spriteWidthRem}rem; height:${spriteHeightRem}rem;}`,
				styleSheet.sheet.cssRules.length
			);
		};
		createNewStyle();
		// Apply the new class to an element
		targetElement.classList.add(className);
	}

	removeCurrentWeaponAndFighterSlot(type) {
		const id = model.uiState.currentWeaponSlot.id;
		const selectors = {
			weapon: `[${DataSet.dataId}="${id}"] .${classNames.weaponSprite}`,
			fighter: `[${DataSet.dataFighterId}="${id}"] .${classNames.weaponSpriteParent}`,
		};

		const selector = selectors[type];
		if (selector) {
			const element = document.querySelector(selector);
			builderCenterView.clearRender(element);
		}
	}

	toCamelCase(str) {
		return str
			.replace(/-/g, "") // Remove all hyphens
			.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
				index === 0 ? letter.toLowerCase() : letter.toUpperCase()
			)
			.replace(/\s+/g, "");
	}
}
export default new HangarController();
