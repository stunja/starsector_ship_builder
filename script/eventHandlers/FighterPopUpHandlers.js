import classNames from "../helper/DomClassNames";

class FighterPopUpHandlers {
	fighterPopUpHoverEffect(callback) {
		const localParent = `.${classNames.weaponPopUpTable}`;
		const eventTarget = `.${classNames.fighter}`;
		const actionType = "mouseover";
		return [localParent, eventTarget, actionType, callback];
	}
	fighterPopUpHeaderHandler(callback) {
		const localParent = `.${classNames.weaponPopUpTableHeader}`;
		const eventTarget = `.${classNames.tableHeader}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	fighterPopUpTableHandler(callback) {
		const localParent = `.${classNames.weaponPopUpTable}`;
		const eventTarget = `.${classNames.fighter}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	fighterPopUpRemoveCurrentWeapon(callback) {
		const localParent = `.${classNames.weaponPopUpTable}`;
		const eventTarget = `.${classNames.weaponPopUpActive}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
}
export default new FighterPopUpHandlers();
