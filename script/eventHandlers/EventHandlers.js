import classNames from "../helper/DomClassNames.js";

class EventHandlers {
	constructor() {
		this.eventListenerFolder = new Map();
	}

	hidePopUpIfClickOutsideHandler(parent, eventTarget, callback) {
		const localParent = document.querySelector(`.${parent}`);
		const localTarget = document.querySelector(`.${eventTarget}`);
		// target direct children NODELIST
		const localChildren = localParent.querySelectorAll(`:scope > *`);
		const actionType = "click";

		document.addEventListener(
			actionType,
			function (e) {
				// check if click is outside target (for example table)
				if (!localTarget.contains(e.target)) {
					// NODELIST
					localChildren.forEach((child) => (child.textContent = ""));

					if (callback) return callback();
				}
			},
			{ once: true }
		);
	}
	fighterShowAdditionaInformation(callback) {
		// classNames.fighterSlots
		// fighterSlotContainer
		const localParent = `.${classNames.fighterSlots}`;
		const eventTarget = `.${classNames.fighterSlot}`;
		const actionType = "mouseover";
		return [localParent, eventTarget, actionType, callback];
	}
	// Fighter Button
	fighterSlotHandler(callback) {
		const localParent = `.${classNames.fighterSlotsContainer}`;
		const eventTarget = `.${classNames.fighterSlot}`;
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	// Generic
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

	// Right View Handlers
	// Handlers
	addCapacitorsHandler(callback) {
		const localParent = ".ship-capacitors__edit";
		const eventTarget = ".button-circle";
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	addVentsHandler(callback) {
		const localParent = ".ship-vents__edit";
		const eventTarget = ".button-circle";
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	openHullModMenuHandler(callback) {
		const localParent = ".hullmods";
		const eventTarget = ".hullmods__buttons button";
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
	}
	addedRegularHullModsHandler(callback) {
		const localParent = ".hullmods__container__added-hullmods";
		const eventTarget = ".added-hullmod__remove-button";
		const actionType = "click";
		return [localParent, eventTarget, actionType, callback];
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
