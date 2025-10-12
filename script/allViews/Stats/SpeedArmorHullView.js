import View from "../View";
// Helper
import CLASS_NAMES from "../../helper/ui/class_names";

const STRINGS = {
	TOP_SPEED: "Top Speed",
	ARMOR: "Armor",
};
class SpeedArmorHull extends View {
	_localParent = `.${CLASS_NAMES.speedArmorHullContainer}`;

	generateMarkup() {
		const userShipBuild = this._data;

		const markup = `
                <li class="${CLASS_NAMES.speedArmorHull__Speed}">
                  <h5>${STRINGS.TOP_SPEED}</h5>
                  <p>${userShipBuild.speed}</p>
                </li>
                <li class="${CLASS_NAMES.speedArmorHull__Armor}">
                  <h5 class="${CLASS_NAMES.speedArmorHull__ArmorTitle}">Armor</h5>
                  <p class="s${CLASS_NAMES.speedArmorHull__ArmorValue}">${userShipBuild.armor}</p>
                </li>
                <li class="${CLASS_NAMES.speedArmorHull__Hull}">
                  <h5>Hull</h5>
                  <p>${userShipBuild.hitPoints}</p>
                </li>
              `;

		return markup;
	}
}
export default new SpeedArmorHull();
