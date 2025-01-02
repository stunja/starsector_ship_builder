import classNames from "../../helper/DomClassNames";
import View from "../view";

const weaponFluxSec = 999999;

//! rework or complete remove
const STRING = {
	FLUX: "Weapon Flux / sec",
};
class WeaponFluxView extends View {
	_localParent = `.${classNames.weaponFlux}`;

	generateMarkup() {
		const markup = `
                <li>
                  <h5>${STRING.FLUX}</h5>
                  <p>${weaponFluxSec}</p>
                </li>
              `;

		return markup;
	}
}
export default new WeaponFluxView();
