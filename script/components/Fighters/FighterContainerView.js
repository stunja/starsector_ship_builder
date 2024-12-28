import classNames from "../../helper/DomClassNames";
import DataSet from "../../helper/DataSet";

const STRING = {
	HEADER: "Fighter Bays",
};
class FighterContainerView {
	render(state) {
		const localParent = `.${classNames.fighterContainer}`;
		const markup = `${this.#fighterContainerMarkup(state.currentShip)}`;

		return [markup, localParent];
	}
	#fighterSlotsMarkup(arr) {
		return arr
			.map(
				(fighterSlot) =>
					`
                        <div class="${classNames.fighterSlotContainer}">
                            <figure class="${classNames.smallImageBox} 
                                ${classNames.fighterSlot}" 
                                ${DataSet.dataFighterId}="${fighterSlot.id}"
                            >
                            </figure>
                        </div>
                    `
			)
			.join("");
	}

	#createFighterSlotsArray = (currentShip) =>
		currentShip.weaponSlots.filter(
			(fighterObject) => fighterObject.type === "LAUNCH_BAY"
		);

	#fighterContainerMarkup(currentShip) {
		const fighterArray = this.#createFighterSlotsArray(currentShip);
		if (fighterArray.length === 0) return "";

		return `
	        <ul class="${classNames.fighterSlotsContainer}">
	          <li class=
                "${classNames.fighterSlotsContainerHeader}"
                >
                <h5>${STRING.HEADER}</h5>
              </li>
	          <li class="${classNames.fighterSlots}">
	            ${this.#fighterSlotsMarkup(fighterArray)}
	          </li>
			  <div class="${classNames.fighterPopUp}"></div>
	        </ul>
	`;
	}
	// fighterBayActiveWeaponSlot(buttonId) {
	// 	const parentElement = this.#parentElementMiddle.querySelector(
	// 		`.${classNames.fighterSlots}`
	// 	);
	// 	if (!parentElement) return;

	// 	this.fighterBayButtonRemoveAllActiveClasses();

	// 	const targetElement = parentElement.querySelector(
	// 		`[${DataSet.dataFighterId}="${buttonId}"]`
	// 	);
	// 	if (targetElement) {
	// 		targetElement.classList.add(classNames.fighterSlotActive);
	// 	}
	// }
	// fighterBayButtonRemoveAllActiveClasses() {
	// 	const parentElement = this.#parentElementMiddle.querySelector(
	// 		`.${classNames.fighterSlots}`
	// 	);

	// 	// Remove active class from all slots first
	// 	parentElement
	// 		.querySelectorAll(`.${classNames.fighterSlot}`)
	// 		.forEach((slot) => slot.classList.remove(classNames.fighterSlotActive));
	// }
	// //!
	// figherBayAddFighterRender(currentWeapon, currentWeaponSlot) {
	// 	const slotId = currentWeaponSlot.id;
	// 	const localParent = `.${classNames.fighterSlots} [${DataSet.dataFighterId}="${slotId}"]`;

	// 	const markup = `${FighterSpritesView.render(currentWeapon)}`;
	// 	return [markup, localParent];
	// }
}
export default new FighterContainerView();
