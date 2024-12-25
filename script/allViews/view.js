import classNames from "../helper/DomClassNames.js";
//
export default class View {
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

		// hover-additional-information
		// weapon-pop-up__table
		// const target = document.querySelector(`.${targetClass}`);

		const targetToRemove = document.querySelector(`.${targetClass}`);

		targetToRemove.textContent = "";
	}
}
