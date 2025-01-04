import DataSet from "../../helper/DataSet";
import classNames from "../../helper/DomClassNames";
import View from "../view";
// import WeaponSpriteView from "./WeaponSpriteView";

class WeaponSlotsView extends View {
	_localParent = `.${classNames.weaponSlots}`;

	generateMarkup() {
		const data = this._data;

		const markup = data.weaponSlots
			.map((slot) => this.#weaponSlotMarkUp(slot))
			.join("");

		return markup;
	}

	#weaponSlotMarkUp(currentWeaponSlot) {
		if (currentWeaponSlot.mount.toLowerCase() === "hidden") return;

		const weaponSize = currentWeaponSlot.size.toLowerCase();
		const weaponType = currentWeaponSlot.type.toLowerCase();

		const markup = `
				<button class="${classNames.weaponSlot} ${
			classNames.weaponSize
		}--${weaponSize} ${classNames.weaponType}--${weaponType}" 
					${DataSet.dataWeaponSlotId}="${currentWeaponSlot.id}">

					<div class="${classNames.weaponSpriteParent}">
						${this.#weaponTypeBackgroundMarkup(currentWeaponSlot)}
					</div>
        			${this.#weaponArcRenderMarkup(currentWeaponSlot)}
				</button>`;
		return markup;
	}
	#weaponTypeBackgroundMarkup = (currentWeaponSlot) => {
		const weaponType = currentWeaponSlot.type.toLowerCase();
		const weaponSize = currentWeaponSlot.size.toLowerCase();
		return this.#weaponBackgroundSprite(weaponType, weaponSize);
	};
	#weaponArcRenderMarkup(currentWeaponSlot) {
		if (!currentWeaponSlot) return "";
		return `<div class="${classNames.weaponArc}" ${DataSet.dataWeaponSlotId}="${currentWeaponSlot.id}" data-arc="${currentWeaponSlot.arc}" data-angle="${currentWeaponSlot.angle}"><div class="${classNames.weaponArcSprite}"></div></div>`;
	}
	#weaponBackgroundSprite(weaponType, weaponSize) {
		return `<div class="${
			classNames.weaponBackgroundSpriteParent
		}">${this.#weaponBackgroundSpriteMarkUpAndSelector(
			weaponType,
			weaponSize
		)}</div>`;
	}
	#weaponBackgroundSpriteMarkUpAndSelector(weaponType, weaponSize) {
		const weaponMarkup = (size, type, oppacity) => {
			return `<div class="${classNames.weaponBackgroundSprite} ${classNames.weaponBackgroundSpriteSize}--${size} ${classNames.weaponBackgroundSpriteType}--${type} ${classNames.weaponBackgroundSpriteOppacity}--${oppacity}"></div>`;
		};
		const weaponTypeSelector = () => {
			if (
				weaponType === "ballistic" ||
				weaponType === "energy" ||
				weaponType === "missile"
			) {
				return weaponSize === "small"
					? weaponMarkup("small", weaponType, "full")
					: weaponSize === "medium"
					? weaponMarkup("small", weaponType, "medium") +
					  weaponMarkup("medium", weaponType, "full")
					: weaponSize === "large"
					? weaponMarkup("small", weaponType, "light") +
					  weaponMarkup("medium", weaponType, "medium") +
					  weaponMarkup("large", weaponType, "full")
					: console.warn("error with weaponSizeLogic");
			}
			if (weaponType === "composite") {
				return (
					weaponMarkup(weaponSize, weaponType, "full") +
					weaponMarkup(weaponSize, weaponType, "full")
				);
			}
			if (weaponType === "hybrid") {
				return (
					weaponMarkup(weaponSize, weaponType, "full") +
					weaponMarkup(weaponSize, weaponType, "full")
				);
			}
			if (weaponType === "decorative") {
				return "";
			}
			if (weaponType === "synergy") {
				return (
					weaponMarkup(weaponSize, weaponType, "full") +
					weaponMarkup(weaponSize, weaponType, "full")
				);
			}
		};
		return weaponTypeSelector();
	}
	// rework
	addWeaponSpriteViewToWeaponSlot(currentWeaponSlotId, weaponObject) {
		const localParent = `[${DataSet.dataWeaponSlotId}="${currentWeaponSlotId.id}"]`;

		const markup = `${WeaponSpriteView.render(
			weaponObject,
			currentWeaponSlotId
		)}`;

		return [markup, localParent];
	}
}

export default new WeaponSlotsView();
