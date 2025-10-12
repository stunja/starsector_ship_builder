import DATASET from "../../helper/ui/datasets";
import CLASS_NAMES from "../../helper/ui/class_names";
//
class WeaponArcView {
	renderElement(currentWeaponSlot) {
		if (!currentWeaponSlot) return "";

		const markup = `
		<div class="${CLASS_NAMES.weaponArc}" 
			${DATASET.dataId}="${currentWeaponSlot.id}" ${DATASET.dataArc}="${currentWeaponSlot.arc}" ${DATASET.dataAngle}="${currentWeaponSlot.angle}">
			<div class="${CLASS_NAMES.weaponArcSprite}"></div>
		</div>`;

		return markup;
	}
}
export default new WeaponArcView();
