import CLASS_NAMES from "../helper/ui/class_names";

class WeaponPopUpHandlers {
	closeIfClickOutsideTargetContainer(className) {
		const localTarget = document.querySelector(`.${className}`);
		const actionType = "click";

		document.addEventListener(
			actionType,
			function (e) {
				// check if click is outside target (for example table)
				if (!localTarget.contains(e.target)) {
					localTarget.textContent = "";
				}
			},
			{ once: true }
		);
	}
	// Handlers
	headerHandler(callback) {
		const localParent = `.${CLASS_NAMES.tableHeader}`;
		const eventTarget = `.${CLASS_NAMES.tableHeaderEntry}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	tableHandler(callback) {
		const localParent = `.${CLASS_NAMES.tableBody}`;
		const eventTarget = `.${CLASS_NAMES.tableEntries}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	weaponPopUpRemoveCurrentWeapon(callback) {
		const localParent = `.${CLASS_NAMES.weaponPopUpTable}`;
		const eventTarget = `.${CLASS_NAMES.weaponPopUpActive}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	weaponPopUpHoverEffect(callback) {
		const localParent = `.${CLASS_NAMES.weaponPopUpTable}`;
		const eventTarget = `.${CLASS_NAMES.weapon}`;
		const actionType = "mouseover";
		return [localParent, eventTarget, actionType, callback];
	}
}
export default new WeaponPopUpHandlers();

// weaponPopUpHeaderHandler(callback) {
// 	const localParent = `.${CLASS_NAMES.weaponPopUpTableHeader}`;
// 	const eventTarget = `.${CLASS_NAMES.tableHeader}`;
// 	const actionType = "click";
// 	return [localParent, eventTarget, actionType, callback];
// }
