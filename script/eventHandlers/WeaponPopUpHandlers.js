import classNames from "../helper/DomClassNames";

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
		const localParent = `.${classNames.tableHeader}`;
		const eventTarget = `.${classNames.tableHeaderEntry}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	tableHandler(callback) {
		const localParent = `.${classNames.tableBody}`;
		const eventTarget = `.${classNames.tableEntries}`;
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
}
export default new WeaponPopUpHandlers();

// weaponPopUpHeaderHandler(callback) {
// 	const localParent = `.${classNames.weaponPopUpTableHeader}`;
// 	const eventTarget = `.${classNames.tableHeader}`;
// 	const actionType = "click";
// 	return [localParent, eventTarget, actionType, callback];
// }
