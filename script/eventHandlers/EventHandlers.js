import classNames from "../helper/DomClassNames.js";

class EventHandlers {
	constructor() {
		this.eventListenerFolder = new Map();
	}
	// Copy of Each other. I can fuse them
	fighterPopUpHideWhenClickOutsideHandler(callback) {
		const localParent = document.querySelector(`.${classNames.fighterPopUp}`);
		const actionType = "click";

		document.addEventListener(
			actionType,
			function (e) {
				if (!localParent.contains(e.target)) {
					localParent.textContent = "";
					return callback(localParent);
				}
			},
			{ once: true }
		);
	}

	weaponPopUpHideWhenClickOutsideHandler() {
		const localParent = document.querySelector(
			`.${classNames.weaponPopUpTable}`
		);
		const targetToRemove = document.querySelector(
			`.${classNames.weaponPopUpParent}`
		);
		const actionType = "click";

		document.addEventListener(
			actionType,
			function (e) {
				if (!localParent.contains(e.target)) {
					targetToRemove.innerHTML = "";
				}
			},
			{ once: true }
		);
	}

	fighterShowAdditionaInformation(callback) {
		// fighter-slots
		// fighter-slot-container
		const localParent = `.${classNames.fighterSlots}`;
		const eventTarget = `.${classNames.fighterSlotContainer}`;
		const actionType = "mouseover";
		return [localParent, eventTarget, actionType, callback];
	}

	addEventListenerReturnDataSet([
		localParent,
		eventTarget,
		actionType,
		callback,
	]) {
		const localParentQuery = document.querySelector(localParent);

		const wrappedCallback = (e) => {
			const btn = e.target.closest(eventTarget);
			// Prevent bubbling
			e.stopPropagation();
			if (!btn) return;
			callback(btn);
		};

		localParentQuery.addEventListener(actionType, wrappedCallback);

		// Store the listener details for later removal
		this.eventListenerFolder.set(callback, {
			localParentQuery,
			actionType,
			wrappedCallback,
		});
	}

	removeEventListener(callback) {
		const listenerDetails = this.eventListenerFolder.get(callback);
		if (listenerDetails) {
			const { localParentQuery, actionType, wrappedCallback } = listenerDetails;
			localParentQuery.removeEventListener(actionType, wrappedCallback);
			this.eventListenerFolder.delete(callback);
		}
	}
}

export default new EventHandlers();
// weaponPopUpHideWhenClickOutsideHandler() {
// 	const localParent = document.querySelector(
// 		`.${this.weaponPopUpParentClass}`
// 	);
// 	const actionType = "click";

// 	document.addEventListener(
// 		actionType,
// 		function (e) {
// 			if (!localParent.contains(e.target)) {
// 				localParent.classList.add(classNames.dNone);
// 			}
// 		},
// 		{ once: true }
// 	);
// }
