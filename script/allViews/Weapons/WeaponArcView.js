import DataSet from "../../helper/DataSet";
import classNames from "../../helper/DomClassNames";
//
class WeaponArcView {
	renderElement(currentWeaponSlot) {
		if (!currentWeaponSlot) return "";

		const markup = `
		<div class="${classNames.weaponArc}" 
			${DataSet.dataId}="${currentWeaponSlot.id}" ${DataSet.dataArc}="${currentWeaponSlot.arc}" ${DataSet.dataAngle}="${currentWeaponSlot.angle}">
			<div class="${classNames.weaponArcSprite}"></div>
		</div>`;

		return markup;
	}
}
export default new WeaponArcView();
