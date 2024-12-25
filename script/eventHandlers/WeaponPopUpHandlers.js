import classNames from "../helper/DomClassNames";

class WeaponPopUpHandlers {
	// Handlers
	headerHandler(callback) {
		const localParent = `.${classNames.tableHeader}`;
		const eventTarget = `.${classNames.tableHeaderEntry}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	weaponPopUpTableHandler(callback) {
		const localParent = `.${classNames.weaponPopUpTable}`;
		const eventTarget = `.${classNames.weapon}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	weaponPopUpRemoveCurrentWeapon(callback) {
		const localParent = `.${classNames.weaponPopUpTable}`;
		const eventTarget = `.${classNames.weaponPopUpActive}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	weaponPopUpHoverEffect(callback) {
		const localParent = `.${classNames.weaponPopUpTable}`;
		const eventTarget = `.${classNames.weapon}`;
		const actionType = "mouseover";
		return [localParent, eventTarget, actionType, callback];
	}
	weaponButtonHandler(callback) {
		const localParent = `.${classNames.weaponSlots}`;
		const eventTarget = `.${classNames.weaponSlot}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
}
export default new WeaponPopUpHandlers();

// weaponPopUpHeaderHandler(callback) {
// 	const localParent = `.${classNames.weaponPopUpTableHeader}`;
// 	const eventTarget = `.${classNames.tableHeader}`;
// 	const actionType = "click";
// 	return [localParent, eventTarget, actionType, callback];
// }
