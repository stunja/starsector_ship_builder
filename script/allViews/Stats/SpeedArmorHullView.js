import classNames from "../../helper/DomClassNames";
import View from "../View";

const STRINGS = {
	TOP_SPEED: "Top Speed",
	ARMOR: "Armor",
};
class SpeedArmorHull extends View {
	_localParent = `.${classNames.speedArmorHullContainer}`;

	generateMarkup() {
		const userShipBuild = this._data;

		const markup = `
                <li class="${classNames.speedArmorHull__Speed}">
                  <h5>${STRINGS.TOP_SPEED}</h5>
                  <p>${userShipBuild.speed}</p>
                </li>
                <li class="${classNames.speedArmorHull__Armor}">
                  <h5 class="${classNames.speedArmorHull__ArmorTitle}">Armor</h5>
                  <p class="s${classNames.speedArmorHull__ArmorValue}">${userShipBuild.armor}</p>
                </li>
                <li class="${classNames.speedArmorHull__Hull}">
                  <h5>Hull</h5>
                  <p>${userShipBuild.hitPoints}</p>
                </li>
              `;

		return markup;
	}
}
export default new SpeedArmorHull();
