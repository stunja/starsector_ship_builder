import classNames from "../../helper/DomClassNames";
import WeaponSpriteView from "./WeaponSpriteView";

class WeaponSlotsView {
	render(state) {
		const localParent = `.${classNames.weaponSlots}`;

		const markup = state.currentShipBuild._baseWeaponSlots
			.map((slot) => this.#weaponSlotMarkUp(slot))
			.join("");

		return [markup, localParent];
	}
	#weaponSlotMarkUp(currentWeaponSlot) {
		if (currentWeaponSlot.mount.toLowerCase() === "hidden") return;

		const weaponSize = currentWeaponSlot.size.toLowerCase();
		const weaponType = currentWeaponSlot.type.toLowerCase();

		const markup = `
				<button class="${classNames.weaponSlot} 
				${classNames.weaponSize}--${weaponSize} ${classNames.weaponType}--${weaponType}"
				data-id="${currentWeaponSlot.id}">

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
		return `<div class="${classNames.weaponArc}" data-id="${currentWeaponSlot.id}" data-arc="${currentWeaponSlot.arc}" data-angle="${currentWeaponSlot.angle}"><div class="${classNames.weaponArcSprite}"></div></div>`;
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
	addWeaponSpriteToWeaponSlot(currentWeaponSlot, weaponObject) {
		const slotId = currentWeaponSlot.id;
		const localParent = `[data-id="${slotId}"]`;
		// const markup = `${this.#weaponIconMarkup(weaponObject, currentWeaponSlot)}`;
		const markup = `${WeaponSpriteView.render(
			weaponObject,
			currentWeaponSlot
		)}`;

		return [markup, localParent];
	}
}

export default new WeaponSlotsView();
// 	const localParent = `.${classNames.weaponSlots}`;
// 	const markup = baseWeaponSlots
// 		.map((slot) => this.#weaponSlotMarkUp(slot))
// 		.join("");
// 	return [markup, localParent];
// }
// #weaponSlotMarkUp(currentWeaponSlot) {
// 	if (currentWeaponSlot.mount.toLowerCase() === "hidden") return;
// 	const weaponSize = currentWeaponSlot.size.toLowerCase();
// 	const weaponType = currentWeaponSlot.type.toLowerCase();
// 	const markup = `
// 				<button class="${classNames.weaponSlot} ${
// 		classNames.weaponSize
// 	}--${weaponSize} ${classNames.weaponType}--${weaponType}"
// 				data-id="${currentWeaponSlot.id}">
// 					<div class="${classNames.weaponSpriteParent}">
// 						${this.#weaponTypeBackgroundMarkup(currentWeaponSlot)}
// 					</div>
//         			${this.#weaponArcRenderMarkup(currentWeaponSlot)}
// 				</button>`;
// 	return markup;
// }
