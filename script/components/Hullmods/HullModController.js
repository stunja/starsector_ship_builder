import ViewModel from "../../ViewModel";
import classNames from "../../helper/DomClassNames";
// View
import AddNewHullModView from "../../allViews/HullMods/AddNewHullModView";
import HullModView from "../../allViews/HullMods/HullModView";
import BuildInHullModsView from "../../allViews/HullMods/BuildInHullModsView";
// HullMods
import HullModsPopUpView from "../../allViews/HullMods/HullModsPopUpView";
import HullModsPopUpHeaderView from "../../allViews/HullMods/HullModsPopUpHeaderView";
import HullModsPopUpTableView from "../../allViews/HullMods/HullModsPopUpTableView";
//

const EVENT_LISTENER_TARGET = {
	HULLMODS: `.${classNames.hullMods__Button}`,
};
const EVENT_LISTENER_TYPE = {
	CLICK: `click`,
};
const HULLMOD_BUTTON_TYPE = {
	OPEN: "open",
	SMODS: "smods",
};
const CLASSES = {
	// hullmods-pop-up
	HULLMODS_POP_UP: `.${classNames.hullModsPopUp}`,
};
export default class HullModController extends ViewModel {
	#userState;
	#allHullMods;
	#userShipBuild;
	constructor(model) {
		super(model);

		this.#userState = this.getUserState();
		this.#allHullMods = this.#userState.usableHullMods;
		this.#userShipBuild = this.#userState.userShipBuild;
	}
	update() {
		this.#hullModContainerRender();
		this.#hullModContainerEventListener();
		this.#renderHullMods();
	}
	#processData() {}
	// Container
	#hullModContainerRender() {
		HullModView.render(this.getUserShipBuild());
	}
	#hullModContainerEventListener() {
		HullModView.addClickHandler(
			EVENT_LISTENER_TARGET.HULLMODS,
			EVENT_LISTENER_TYPE.CLICK,
			this.#openHullModPopUp
		);
	}

	#renderHullMods() {
		//! problem is here
		BuildInHullModsView.render([this.#userShipBuild, this.#allHullMods]);
	}
	#openHullModPopUp = (btn) => {
		const { hullmodButtonType } = btn.dataset;
		if (hullmodButtonType === HULLMOD_BUTTON_TYPE.OPEN) {
			this.#renderHullModsPopUp();
		}
		if (hullmodButtonType === HULLMOD_BUTTON_TYPE.SMODS) {
			console.log("smods");
		}
		this.#closePopUpForm();
	};
	#closePopUpForm() {
		// Close if clicked outside
		// HullModsPopUpView.closePopUpContainerIfUserClickOutside(
		// 	`.${classNames.tableContainer}`,
		// 	HullModsPopUpView._clearRender
		// );
	}
	#renderHullModsPopUp() {
		HullModsPopUpView.render(this.#allHullMods);
		HullModsPopUpHeaderView.render(this.#userShipBuild);
		HullModsPopUpTableView.render(this.#allHullMods);
		// console.log("open");
	}
}
// addHullMod(hullMod, activeHullMods) {
// 	activeHullMods.push(hullMod);
// 	ordinancePointsController.updateCurrentOrdinancePoints(
// 		calculateHullModCost(hullMod)
// 	);
// 	// Add new hull mod, and new controller for it, so you can remove it on the right side.
// 	EventHandlers.removeEventListener(hullModController.addRemoveHullMod);
// 	EventHandlers.addEventListenerReturnDataSet(
// 		EventHandlers.addedRegularHullModsHandler(
// 			hullModController.addRemoveHullMod
// 		)
// 	);
// 	builderLogic.hullModLogic();
// }
// removeHullMod(hullMod, activeHullMods) {
// 	ordinancePointsController.updateCurrentOrdinancePoints(
// 		-calculateHullModCost(hullMod)
// 	);
// 	model.state.currentShipBuild.hullMods.activeHullMods =
// 		activeHullMods.filter((mod) => mod.id !== hullMod.id);

// 	builderLogic.hullModLogic();
// }
// showMoreButtonToggle(btn) {
// 	const { id } = btn.dataset;
// 	const target = document.querySelector(`#hullmod__${id} .hullmod__desc`);

// 	//
// 	const fullText = model.state.usableHullMods
// 		.map((hullMod) => (hullMod.id === id ? hullMod.desc : ""))
// 		.join("");

// 	target.innerHTML = `${fullText} <button class="hullmod__desc__close hullmod__desc__show-more" ${DataSet.dataId}="${id}">[Close]</button>`;
// }
// hideHullModDescription(btn) {
// 	const { id } = btn.dataset;
// 	const target = document.querySelector(`#hullmod__${id} .hullmod__desc`);
// 	const hullModDescription = model.state.usableHullMods
// 		.map((hullMod) => (hullMod.id === id ? hullMod.desc : ""))
// 		.join("");
// 	const fullText = builderPopUpView.hullModDescriptionShrink([
// 		hullModDescription,
// 		id,
// 	]);

// 	target.innerHTML = `${fullText}`;
// }
