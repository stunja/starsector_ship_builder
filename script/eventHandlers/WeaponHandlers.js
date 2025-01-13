import classNames from "../helper/DomClassNames";

class WeaponHandlers {
	weaponOpenPopUpMenuHandler(callback) {
		const localParent = `.${classNames.weaponSlots}`;
		const eventTarget = `.${classNames.weaponSlot}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
}
export default new WeaponHandlers();
