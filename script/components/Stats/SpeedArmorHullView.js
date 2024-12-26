import classNames from "../../helper/DomClassNames";

class SpeedArmorHull {
	render(state) {
		const localParent = `.${classNames.speedArmorHullContainer}`;
		const currentShipBuild = state.currentShipBuild;

		const markup = `
                <li class="${classNames.speedArmorHull__Speed}">
                  <h5>Top Speed</h5>
                  <p>${currentShipBuild.currentSpeed}</p>
                </li>
                <li class="${classNames.speedArmorHull__Armor}">
                  <h5 class="${classNames.speedArmorHull__ArmorTitle}">Armor</h5>
                  <p class="s${classNames.speedArmorHull__ArmorValue}">${currentShipBuild.currentArmor}</p>
                </li>
                <li class="${classNames.speedArmorHull__Hull}">
                  <h5>Hull</h5>
                  <p>${currentShipBuild.currentHitPoints}</p>
                </li>
              `;

		return [markup, localParent];
	}
}
export default new SpeedArmorHull();
