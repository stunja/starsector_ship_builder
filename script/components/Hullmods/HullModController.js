import ViewModel from "../../ViewModel";
import HullModView from "../../allViews/HullMods/HullModView";
import BuildInHullModsView from "../../allViews/HullMods/BuildInHullModsView";
import AddNewHullModView from "../../allViews/HullMods/AddNewHullModView";
import classNames from "../../helper/DomClassNames";

const EVENT_LISTENER_TARGET = {
	HULLMODS: `.${classNames.hullMods__Button}`,
};
export default class HullModController extends ViewModel {
	constructor(model) {
		super(model);
	}
	update() {
		this.#hullModBase();
		this.#buildInHullMods();

		//! Not implemented
		// this.#addNewHullMod();
	}
	#hullModBase() {
		HullModView.render(this.getUserShipBuild());
		HullModView.addClickHandler(EVENT_LISTENER_TARGET.HULLMODS, this.test);
	}
	#buildInHullMods() {
		BuildInHullModsView.render([
			this.getUserShipBuild(),
			this.getUsableHullMods(),
		]);
	}
	//! DEV
	test(btn) {
		console.log(btn);
	}
	//! Not implemented
	#addNewHullMod() {
		const { activeHullMods } = model.state.currentShipBuild.hullMods;
		if (!activeHullMods) return "";

		builderView.renderComponent(AddNewHullModView.render(model.state));
	}
	//! None of this is CONNECTED
	////////////////
	openHullModMenuController = () => {
		// openHullModMenuHandler Handler Pair
		builderRightView.renderComponent(builderRightView.hullModMarkUp());
		builderRightView.renderComponent(builderRightView.buildInHullModRender());
		//
		// hullModController.hullModsMenuRegular();
		//
		EventHandlers.removeEventListener(hullModController.hullModsMenu);
		EventHandlers.addEventListenerReturnDataSet(
			EventHandlers.openHullModMenuHandler(hullModController.hullModsMenu)
		);
	};
	popUpHullModMenuBehavior(btn) {
		if (!btn) return;
		builderPopUpView.filterArrayAccordingToSelectedFilterTag(btn);
		builderPopUpView.render(model.state);
		builderPopUpView.addRemoveHullModToggleButtonRender();

		//? Filter (Header)
		// popUpHullModMenuBehavior Handler Pair
		EventHandlers.removeEventListener(
			hullModController.popUpHullModMenuBehavior
		);
		EventHandlers.addEventListenerReturnDataSet(
			builderPopUpView.popUpFilterHandler(
				hullModController.popUpHullModMenuBehavior
			)
		);
		// Add Remove Hull Mod Handler Pair
		EventHandlers.removeEventListener(hullModController.addRemoveHullMod);
		EventHandlers.addEventListenerReturnDataSet(
			builderPopUpView.addHandlerToAddRemoveHullMod(
				hullModController.addRemoveHullMod
			)
		);
	}
	hullModsMenu(btn) {
		const { type } = btn.dataset;
		if (!type) return;
		if (type === "regular") {
			hullModController.hullModsMenuRegular(btn);
		}
		if (type === "smods") {
			hullModController.hullModsMenuSmods(btn);
		}
	}
	hullModsMenuRegular(btn) {
		//
		model.uiState.hullModsMenu.menuState === "closed"
			? (model.uiState.hullModsMenu.menuState = "open")
			: (model.uiState.hullModsMenu.menuState = "closed");
		//
		if (model.uiState.hullModsMenu.menuState === "open") {
			// initializations
			if (btn) {
				btn.classList.add("hullmods__buttons__open-hullmod-menu--warn");
				btn.textContent = "Close Menu";
			}
			this.hullModsMenuHandlersAndRender();
		}
		if (model.uiState.hullModsMenu.menuState === "closed") {
			if (btn) {
				btn.classList.remove("hullmods__buttons__open-hullmod-menu--warn");
				btn.textContent = "Open HullMod Menu";
			}
			//! remove handler
			//! popupview reset the filter to ALL
			builderPopUpView.removeRender();
		}
	}
	hullModsMenuHandlersAndRender() {
		builderPopUpView.masterRender(model.state);

		// Pop Up Menu Handler
		EventHandlers.removeEventListener(
			hullModController.popUpHullModMenuBehavior
		);
		EventHandlers.addEventListenerReturnDataSet(
			builderPopUpView.popUpFilterHandler(
				hullModController.popUpHullModMenuBehavior
			)
		);

		// Add / Remove Buttons Handler
		EventHandlers.removeEventListener(hullModController.addRemoveHullMod);
		EventHandlers.addEventListenerReturnDataSet(
			builderPopUpView.addHandlerToAddRemoveHullMod(
				hullModController.addRemoveHullMod
			)
		);

		// Show More Description Btn Handler
		EventHandlers.removeEventListener(hullModController.showMoreButtonToggle);
		EventHandlers.addEventListenerReturnDataSet(
			builderPopUpView.showMoreHullModDescriptionHandler(
				hullModController.showMoreButtonToggle
			)
		);
		// Hide Description Btn Handler
		EventHandlers.removeEventListener(hullModController.hideHullModDescription);
		EventHandlers.addEventListenerReturnDataSet(
			builderPopUpView.hideHullModDescriptionHandler(
				hullModController.hideHullModDescription
			)
		);
		// Render
		builderPopUpView.addRemoveHullModToggleButtonRender();
	}
	hullModsMenuSmods() {
		console.log("smods");
	}
	addRemoveHullMod(btn) {
		if (!btn) return;

		const [activeHullMods, filteredHullMod, isHullModActive] =
			hullModController.addRemoveHullModFilterHelperFunction(btn);

		hullModController.addRemoveHullModToggle(
			activeHullMods,
			filteredHullMod,
			isHullModActive
		);
		// checks and renders change in button state. Fancy, as should check if menu closed or open.
		builderPopUpView.addRemoveHullModToggleButtonRender();
		//
		builderRightView.renderComponent(builderRightView.addNewHullModRender());
	}
	addRemoveHullModFilterHelperFunction(btn) {
		const state = {
			currentShipBuild: model.state.currentShipBuild,
			usableHullMods: model.state.usableHullMods,
		};

		if (!state.currentShipBuild.hullMods.activeHullMods) {
			state.currentShipBuild.hullMods.activeHullMods = [];
		}
		const { activeHullMods } = state.currentShipBuild.hullMods;
		const { id } = btn.dataset;
		const filteredHullMod = state.usableHullMods.find((e) => e.id === id);

		const isHullModActive = activeHullMods.some(
			(hullMod) => hullMod.id === filteredHullMod.id
		);
		return [activeHullMods, filteredHullMod, isHullModActive];
	}
	addRemoveHullModToggle(activeHullMods, filteredHullMod, isHullModActive) {
		if (!isHullModActive) {
			hullModController.addHullMod(filteredHullMod, activeHullMods);
		}
		if (isHullModActive) {
			hullModController.removeHullMod(filteredHullMod, activeHullMods);
		}
	}
	addHullMod(hullMod, activeHullMods) {
		activeHullMods.push(hullMod);
		ordinancePointsController.updateCurrentOrdinancePoints(
			calculateHullModCost(hullMod)
		);
		// Add new hull mod, and new controller for it, so you can remove it on the right side.
		EventHandlers.removeEventListener(hullModController.addRemoveHullMod);
		EventHandlers.addEventListenerReturnDataSet(
			EventHandlers.addedRegularHullModsHandler(
				hullModController.addRemoveHullMod
			)
		);
		builderLogic.hullModLogic();
	}
	removeHullMod(hullMod, activeHullMods) {
		ordinancePointsController.updateCurrentOrdinancePoints(
			-calculateHullModCost(hullMod)
		);
		model.state.currentShipBuild.hullMods.activeHullMods =
			activeHullMods.filter((mod) => mod.id !== hullMod.id);

		builderLogic.hullModLogic();
	}
	showMoreButtonToggle(btn) {
		const { id } = btn.dataset;
		const target = document.querySelector(`#hullmod__${id} .hullmod__desc`);

		//
		const fullText = model.state.usableHullMods
			.map((hullMod) => (hullMod.id === id ? hullMod.desc : ""))
			.join("");

		target.innerHTML = `${fullText} <button class="hullmod__desc__close hullmod__desc__show-more" ${DataSet.dataId}="${id}">[Close]</button>`;
	}
	hideHullModDescription(btn) {
		const { id } = btn.dataset;
		const target = document.querySelector(`#hullmod__${id} .hullmod__desc`);
		const hullModDescription = model.state.usableHullMods
			.map((hullMod) => (hullMod.id === id ? hullMod.desc : ""))
			.join("");
		const fullText = builderPopUpView.hullModDescriptionShrink([
			hullModDescription,
			id,
		]);

		target.innerHTML = `${fullText}`;
	}
}
