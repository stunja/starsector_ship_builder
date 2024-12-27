import classNames from "../../helper/DomClassNames";

const weaponFluxSec = 999999;

//! rework or complete remove
class WeaponFluxView {
	render() {
		const localParent = `.${classNames.weaponFlux}`;

		const markup = `
                <li>
                  <h5>Weapon Flux / sec</h5>
                  <p>${weaponFluxSec}</p>
                </li>
              `;

		return [markup, localParent];
	}
}
export default new WeaponFluxView();
