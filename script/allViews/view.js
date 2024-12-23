import classNames from "../helper/DomClassNames.js";
//
export default class View {
	// constructor() {
	// 	this.eventListenerFolder = new Map();
	// }

	renderComponent([markup, localParent]) {
		// if (!markup || !localParent) console.warn(`renderComponentGeneric Error ${localParent}`);
		this.clearRender(document.querySelector(localParent));

		document
			.querySelector(localParent)
			.insertAdjacentHTML("afterbegin", markup);
	}
	updateText = (target, value) => {
		document.querySelector(`.${target}`).textContent = `${value}`;
	};
	clearRender = (parentElement) => (parentElement.textContent = "");

	weaponPopUpFormRemover(currentWeaponSlot) {
		const weaponTypeCheck =
			currentWeaponSlot.type === "LAUNCH_BAY" ? "fighter" : "weapon";

		const targetClass =
			weaponTypeCheck === "weapon"
				? classNames.weaponPopUp
				: classNames.fighterPopUp;

		const target = document.querySelector(`.${targetClass}`);

		target.textContent = "";
	}

	//? I dont remember how it works
	// addEventListenerReturnDataSet([
	// 	localParent,
	// 	eventTarget,
	// 	actionType,
	// 	callback,
	// ]) {
	// 	const localParentQuery = document.querySelector(localParent);

	// 	const wrappedCallback = (e) => {
	// 		const btn = e.target.closest(eventTarget);
	// 		// Prevent bubbling
	// 		e.stopPropagation();
	// 		if (!btn) return;
	// 		callback(btn);
	// 	};

	// 	localParentQuery.addEventListener(actionType, wrappedCallback);

	// 	// Store the listener details for later removal
	// 	this.eventListenerFolder.set(callback, {
	// 		localParentQuery,
	// 		actionType,
	// 		wrappedCallback,
	// 	});
	// }

	// removeEventListener(callback) {
	// 	const listenerDetails = this.eventListenerFolder.get(callback);
	// 	if (listenerDetails) {
	// 		const { localParentQuery, actionType, wrappedCallback } = listenerDetails;
	// 		localParentQuery.removeEventListener(actionType, wrappedCallback);
	// 		this.eventListenerFolder.delete(callback);
	// 	}
	// }
}
