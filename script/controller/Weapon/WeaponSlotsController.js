import builderView from "../../allViews/builderView.js";
import WeaponSlotsView from "../../components/Weapons/WeaponSlotsView.js";
// Generic
import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";
// Event
// Model
import * as model from "../../model.js";

const TARGET_REM = 10; // rem for shipSpriteSize / WeaponSlotsPosition / shipGAP

class WeaponSlotsController {
	init() {
		builderView.renderComponent(WeaponSlotsView.render(model.state));

		this.#weaponSlotPositionUpdate();
		this.#weaponArcsUpdate();
	}

	//
	#weaponSlotPositionUpdate() {
		const { viewOffset, center, width, height } = model.state.currentShip;
		const allWeaponSlotsElements = document.querySelectorAll(
			`.${classNames.weaponSlot}`
		);
		const weaponSlots = model.state.currentShipBuild._baseWeaponSlots;
		const centerX = center[0] - width;
		const centerY = center[1] - height;

		//

		allWeaponSlotsElements.forEach((weaponElement) => {
			const { weaponSlotId } = weaponElement.dataset;
			const [currentWeaponSlotData] = weaponSlots.filter(
				(slot) => slot.id === weaponSlotId
			);

			const currentWeaponSlotLocationData = currentWeaponSlotData.locations;
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
	#weaponArcsUpdate() {
		const weaponArcs = document.querySelectorAll(`.${classNames.weaponArc}`);

		weaponArcs.forEach((wpnArc) => {
			const secondaryArc = wpnArc.querySelector(
				`.${classNames.weaponArcSprite}`
			);
			//
			const { arc, angle } = wpnArc.dataset;
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
	renderWeaponSpritesFromInstalledWeapons() {
		const { currentInstalledWeapons, currentWeaponSlots } =
			model.state.currentShipBuild;
		const { allWeapons } = model.state;

		const findWeaponObject = (currentWeaponId) =>
			allWeapons.filter((weapon) => weapon.id === currentWeaponId);

		const findCurrentWeaponSlot = (wpnSlotId) =>
			currentWeaponSlots.filter((wpnSlot) => wpnSlot.id === wpnSlotId);

		currentInstalledWeapons.forEach((installedWeapon) => {
			const [slotId, weaponId] = installedWeapon;
			if (weaponId === "" || !weaponId) return;

			const [currentWeaponObject] = findWeaponObject(weaponId);
			const [currentWeaponSlot] = findCurrentWeaponSlot(slotId);

			builderView.renderComponent(
				WeaponSlotsView.addWeaponSpriteViewToWeaponSlot(
					currentWeaponSlot,
					currentWeaponObject
				)
			);
			this.#weaponSpriteRotate(currentWeaponSlot);
			this.#currentWeaponSpritePxIntoRemConversion(currentWeaponSlot);
		});
	}
	#weaponSpriteRotate(currentWeaponSlot) {
		const { id: weaponSlotId, angle } = currentWeaponSlot;
		const localParent = `[${DataSet.dataWeaponSlotId}="${weaponSlotId}"]`;

		const targetElement = document.querySelector(
			`.${classNames.weaponSlot}${localParent} .${classNames.weaponSprite}`
		);

		targetElement.style.setProperty("--weapon-rotate", `${-angle}deg`);
	}
	#currentWeaponSpritePxIntoRemConversion(currentWeaponSlot) {
		const { id: weaponSlotId } = currentWeaponSlot;

		const localParent = `[${DataSet.dataWeaponSlotId}="${weaponSlotId}"]`;
		const target = document.querySelector(
			`${localParent} .${classNames.weaponSprite}`
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
export default new WeaponSlotsController();