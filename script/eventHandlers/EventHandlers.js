import CLASS_NAMES from "../helper/ui/class_names";

class EventHandlers {
	constructor() {
		this.eventListenerFolder = new Map();
	}
	fighterShowAdditionaInformation(callback) {
		// fighterSlotContainer
		const localParent = `.${CLASS_NAMES.fighterSlots}`;
		const eventTarget = `.${CLASS_NAMES.fighterSlot}`;
		const actionType = "mouseover";
		return [localParent, eventTarget, actionType, callback];
	}
	// Fighter Button
	fighterSlotHandler(callback) {
		const localParent = `.${CLASS_NAMES.fighterSlotsContainer}`;
		const eventTarget = `.${CLASS_NAMES.fighterSlot}`;
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
