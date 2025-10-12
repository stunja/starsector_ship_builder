import CLASS_NAMES from "../helper/ui/class_names";

class FighterPopUpHandlers {
	fighterPopUpHoverEffect(callback) {
		const localParent = `.${CLASS_NAMES.weaponPopUpTable}`;
		const eventTarget = `.${CLASS_NAMES.fighter}`;
		const actionType = "mouseover";
		return [localParent, eventTarget, actionType, callback];
	}
	fighterPopUpHeaderHandler(callback) {
		const localParent = `.${CLASS_NAMES.weaponPopUpTableHeader}`;
		const eventTarget = `.${CLASS_NAMES.tableHeader}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	fighterPopUpTableHandler(callback) {
		const localParent = `.${CLASS_NAMES.weaponPopUpTable}`;
		const eventTarget = `.${CLASS_NAMES.fighter}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	fighterPopUpRemoveCurrentWeapon(callback) {
		const localParent = `.${CLASS_NAMES.weaponPopUpTable}`;
		const eventTarget = `.${CLASS_NAMES.weaponPopUpActive}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
}
export default new FighterPopUpHandlers();
