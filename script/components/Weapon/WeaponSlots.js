// View
import WeaponSlotsView from "../../allViews/Weapons/WeaponSlotsView.js";
// Components
import ViewModel from "../../ViewModel.js";
import WeaponPopUp from "./WeaponPopUp.js";
// Helper
import CLASS_NAMES from "../../helper/ui/class_names.js";
import DATASET from "../../helper/ui/datasets.js";
import {
	weaponSlotIdIntoWeaponSlotObject,
	findCurrentWeaponSlotFromWeaponSlotId,
} from "../../helper/helper_functions.js";
import { WEAPON_SLOT } from "../../helper/ship_properties.js";

const TARGET_REM = 10; // rem for shipSpriteSize / WeaponSlotsPosition / shipGAP

export default class WeaponSlots extends ViewModel {
	#weaponPopUp;
	constructor(model) {
		super(model);

		this.#weaponPopUp = new WeaponPopUp(model);
	}
	async update() {
		// Render
		await this.#weaponSlotsRender();
		// Add Listener
		this.#addWeaponPopUpListener();
		// Repostion WeaponSlots
		this.#weaponSlotPositionUpdate();
		// Add Arcs
		this.#weaponArcsUpdate();
		// Render Installed Weapons
		// Rotate them + convert into Rems
		this.#renderWeaponSpritesFromInstalledWeapons();
	}

	async #weaponSlotsRender() {
		const userShipBuild = this.getUserShipBuild();
		const getAllWeapons = this.getDataState().allWeapons;

		return await WeaponSlotsView.renderAsync([userShipBuild, getAllWeapons]);
	}
	#addWeaponPopUpListener() {
		const target = `.${CLASS_NAMES.weaponSlot}`;
		WeaponSlotsView.addClickHandler(target, "click", this.#weaponPopUp.update);
	}
	// Old code, It would be nice to rework it
	#weaponSlotPositionUpdate() {
		// const { viewOffset, center, width, height } = model.state.currentShip;
		const userShipBuild = this.getUserShipBuild();
		const { center, width, height } = userShipBuild.secondaryData;

		const allWeaponSlotsElements = document.querySelectorAll(
			`.${CLASS_NAMES.weaponSlot}`
		);
		const weaponSlots = userShipBuild.weaponSlots;
		const centerX = center[0] - width;
		const centerY = center[1] - height;

		//

		allWeaponSlotsElements.forEach((weaponElement) => {
			const { weaponSlotId } = weaponElement.DATASET;

			const currentWeaponSlot = weaponSlotIdIntoWeaponSlotObject(
				weaponSlots,
				weaponSlotId
			);

			const currentWeaponSlotLocationData = currentWeaponSlot.locations;

			const posX = currentWeaponSlotLocationData[1];
			const posY = currentWeaponSlotLocationData[0];

			const posLeft = -posX - centerX;
			const posTop = -posY - centerY;

			const posLeftRem = posLeft / TARGET_REM;
			const posTopRem = posTop / TARGET_REM;

			//
			weaponElement.style.left = `${posLeftRem}rem`;
			weaponElement.style.top = `${posTopRem}rem`;
		});
	}
	// Old code, It would be nice to rework it
	#weaponArcsUpdate() {
		const weaponArcs = document.querySelectorAll(`.${CLASS_NAMES.weaponArc}`);

		weaponArcs.forEach((wpnArc) => {
			const secondaryArc = wpnArc.querySelector(
				`.${CLASS_NAMES.weaponArcSprite}`
			);
			//
			const { arc, angle } = wpnArc.DATASET;
			const halfArc = arc / 2;
			let reverseAngle = -angle;
			// Arc consists of two lines, after and before, and use weapon angle to rotate
			wpnArc.style.setProperty("--after-rotate", `${halfArc}deg`);
			wpnArc.style.setProperty("--before-rotate", `-${halfArc}deg`);
			wpnArc.style.setProperty("--weapon-angle", `${reverseAngle}deg`);
			// Second arc is child of first arc. It is a border.
			secondaryArc.style.setProperty("--arc-mask-color", `${arc}deg`);
			secondaryArc.style.setProperty("--arc-mask-transparent", `${arc}deg`);
		});
	}
	#renderWeaponSpritesFromInstalledWeapons() {
		const { installedWeapons, weaponSlots } = this.getUserShipBuild();

		installedWeapons.forEach((installedWeapon) => {
			const [slotId, weaponId] = installedWeapon;
			if (weaponId === "" || !weaponId) return;

			const currentWeaponSlot = findCurrentWeaponSlotFromWeaponSlotId(
				weaponSlots,
				slotId
			);

			this.#weaponSpriteRotate(currentWeaponSlot);
			this.#currentWeaponSpritePxIntoRemConversion(currentWeaponSlot);
		});
	}
	#weaponSpriteRotate(currentWeaponSlot) {
		const { id: weaponSlotId, angle, mount } = currentWeaponSlot;

		// Some slots are hidden, not need to rotate them
		if (mount === WEAPON_SLOT.MOUNT.HIDDEN) return null;

		const localParent = `[${DATASET.dataWeaponSlotId}="${weaponSlotId}"]`;

		const targetElement = document.querySelector(
			`.${CLASS_NAMES.weaponSlot}${localParent} .${CLASS_NAMES.weaponSprite}`
		);
		targetElement.style.setProperty("--weapon-rotate", `${-angle}deg`);
	}
	#currentWeaponSpritePxIntoRemConversion(currentWeaponSlot) {
		const { id: weaponSlotId, mount } = currentWeaponSlot;

		// Some slots are hidden, not need to rotate them
		if (mount === WEAPON_SLOT.MOUNT.HIDDEN) return null;

		const localParent = `[${DATASET.dataWeaponSlotId}="${weaponSlotId}"]`;
		const target = document.querySelector(
			`${localParent} .${CLASS_NAMES.weaponSprite}`
		);
		const targetChildren = Array.from(target.children);

		const [base, gun] = targetChildren;
		const calc = (value) => value / TARGET_REM;

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
	}
}
