import CLASS_NAMES from "../helper/ui/class_names";

class WeaponHandlers {
	weaponOpenPopUpMenuHandler(callback) {
		const localParent = `.${CLASS_NAMES.weaponSlots}`;
		const eventTarget = `.${CLASS_NAMES.weaponSlot}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
}
export default new WeaponHandlers();
