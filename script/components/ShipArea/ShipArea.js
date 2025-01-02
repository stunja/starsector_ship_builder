import classNames from "../../helper/DomClassNames.js";
import ViewModel from "../../ViewModel.js";
import ShipAreaView from "../../allViews/Weapons/ShipAreaView.js";
import WeaponSlots from "../Weapon/WeaponSlots.js";

const TARGET_REM = 10; // rem for shipSpriteSize / WeaponSlotsPosition / shipGAP

export default class ShipArea extends ViewModel {
	#weaponSlots;
	constructor(model) {
		super(model);

		this.#weaponSlots = new WeaponSlots(model);
	}

	update() {
		this.#containerRender();

		this.#weaponSlots.update();
		// WeaponOpenPopUpMenu.addEventListener();
	}
	#containerRender() {
		ShipAreaView.render(this.getUserShipBuild());

		this.#shipSpriteUpdate();
	}

	#shipSpriteUpdate() {
		const { width, height } = this.getUserShipBuild().secondaryData;
		const targetElement = document.querySelector(`.${classNames.shipSprite}`);
		const className = classNames.currentShipSprite;

		// Convert pixel dimensions to rems
		const dimensions = {
			width: width / TARGET_REM,
			height: height / TARGET_REM,
		};

		this.#addSpriteStyles(className, dimensions);
		targetElement.classList.add(className);
	}
	#addSpriteStyles(className, { width, height }) {
		const styleSheet = document.createElement("style");
		styleSheet.type = "text/css";

		const cssRule = `.${className} { 
			width: ${width}rem; 
			height: ${height}rem;
		}`;

		document.head.appendChild(styleSheet);
		styleSheet.sheet.insertRule(cssRule, styleSheet.sheet.cssRules.length);
	}
	// Not implemented
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
