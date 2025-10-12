import View from "../view";

// helper
import CLASS_NAMES from "../../helper/ui/class_names";

const weaponFluxSec = 999999;

//! rework or complete remove
const STRING = {
	FLUX: "Weapon Flux / sec",
};
class WeaponFluxView extends View {
	_localParent = `.${CLASS_NAMES.weaponFlux}`;

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
