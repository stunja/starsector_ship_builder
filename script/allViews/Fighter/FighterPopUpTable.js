import View from "../view.js";
import classNames from "../../helper/DomClassNames.js";
import FighterSprites from "./FighterSprites.js";

import { capitalizeFirstLetter } from "../../helperFunction.js";
import * as URL from "../../url.js";

class FighterPopUpTable extends View {
	#fighterStringConversion(fighterId) {
		return fighterId
			.replaceAll("_wing", "")
			.split("_")
			.map((arr) => capitalizeFirstLetter(arr))
			.join(" ");
	}
	#findCurrentInstalledWeapon(
		currentWeaponSlot,
		weaponId,
		currentInstalledWeapons
	) {
		return currentInstalledWeapons.find(
			([slotId, wpnId]) => slotId === currentWeaponSlot.id && wpnId === weaponId
		);
	}

	#checkIfCorrectWeapon(wpnObj, currentInstalledWeapons, currentWeaponSlot) {
		const [correctWeaponValue] = currentInstalledWeapons.filter((wpn) => {
			if (wpn[0] === currentWeaponSlot.id && wpn[1] === wpnObj.id) {
				return true;
			}
		});
		if (correctWeaponValue) {
			return true;
		}
	}

	#activeClass(wpnObj, currentInstalledWeapons, currentWeaponSlot) {
		if (
			this.#checkIfCorrectWeapon(
				wpnObj,
				currentInstalledWeapons,
				currentWeaponSlot
			)
		) {
			return ` ${classNames.weaponPopUpActive}`;
		}
		return "";
	}
	// I dont like this.
	#processWeaponArray(weaponArray, currentInstalledWeapons, currentWeaponSlot) {
		let activeWeaponClassObject;

		const modifiedWeaponsArray = weaponArray.filter((wpnObj) => {
			const currentInstalledWeaponKeyPair = this.#findCurrentInstalledWeapon(
				currentWeaponSlot,
				wpnObj.id,
				currentInstalledWeapons
			);

			if (currentInstalledWeaponKeyPair) {
				activeWeaponClassObject = wpnObj;
				return false;
			}
			return true;
		});

		if (activeWeaponClassObject) {
			modifiedWeaponsArray.unshift(activeWeaponClassObject);
		}

		return modifiedWeaponsArray;
	}

	//? Render
	// There is MAX of 6 fighters. I need to check number of fighters
	fighterSpritesRender(currentFighterObject) {
		const currentWeaponSprite =
			currentFighterObject.additionalFighterData.spriteName;
		const maxFighters = currentFighterObject.num;

		const spriteLocation = `./${URL.DATA}/${currentWeaponSprite}`;

		// Draw the sprite | Sprites can be drawn up to 6 in the same component
		// I then use CSS to position them correctly.
		const fighterSpriteMarkUp = (fighterNumber, fighterMax) =>
			`<img src="${spriteLocation}" alt="fighter sprite" class="${classNames.fighterSprite} ${classNames.fighterSprite}--${fighterNumber} ${classNames.fighterSpritesMax}--${fighterMax}" />`;

		// Draw sprites equal to number of fighters
		const fighterStringArray = Array.from({ length: maxFighters }, (_, i) => {
			return `${fighterSpriteMarkUp(i + 1, maxFighters)}`;
		}).join("");

		const markup = `
					<div class="${classNames.weaponSpriteParent}">
						<div class="${classNames.fighterSpriteContainer}">
                            ${fighterStringArray}
						</div>
					</div>`;
		return markup;
	}

	render() {
		const localParent = `.${classNames.fighterPopUp}`;
		//! Delete ? Maybe
		// document
		// 	.querySelector(`.${classNames.weaponPopUpParent}`)
		// 	.classList.remove(`${classNames.dNone}`);

		const markup = `
			<div class="${classNames.fighterPopUpContainer}">
				<div class="${classNames.hoverAdditionalInformation}"></div>
				<div class="${classNames.weaponPopUpTable}">
					<ul class="${classNames.weaponPopUpFilter}"></ul>
					<div class="${classNames.weaponPopUpTableWrapper}">
						<table class="${classNames.weaponPopUpTableBody}">
							<thead></thead>
							<tbody></tbody>
						</table>
					</div>
				</div>
			</div>
    `;
		return [markup, localParent];
	}
	tableHeaderRender() {
		const localParent = `.${classNames.weaponPopUpTable} thead`;
		const dataCategory = [
			{
				label: "Name",
				category: "name",
			},
			{
				label: "Role",
				category: "role",
			},
			{
				label: "Range",
				category: "range",
			},
			{
				label: "Cost",
				category: "cost",
			},
		];
		const headerCategoryMarkUp = dataCategory
			.map(
				({ label, category }) => `
						<th class="${classNames.weaponPopUpTableHeader} ${classNames.tableHeader} ${classNames.unselectable}" data-category="${category}">
							<div>
								<p>${label}</p>
							</div>
						</th>`
			)
			.join("");

		const markup = `
					<tr class="${classNames.weaponPopUpTableHeader}">
						<th></th>
						${headerCategoryMarkUp}
					</tr>
				`;

		return [markup, localParent];
	}
	tableContentRender(weaponArray, currentInstalledWeapons, currentWeaponSlot) {
		const localParent = `.${classNames.weaponPopUpTable} tbody`;

		// prettier-ignore
		const markup = this.#processWeaponArray(weaponArray, currentInstalledWeapons, currentWeaponSlot)
			.map((fighterObj) => {
				//
				const markup = `
                    <tr class="${classNames.fighter}${this.#activeClass(fighterObj, currentInstalledWeapons, currentWeaponSlot)}" data-id="${fighterObj.id}">
                            <td class="${classNames.fighterSprites}">
                                ${FighterSprites.render(fighterObj)}
                            </td>
							<td class="${classNames.fighterName}">
                                ${this.#fighterStringConversion(fighterObj.id)}
                            </td>
							<td class="${classNames.fighterType}">${fighterObj.role}</td>
							<td class="${classNames.fighterRange}">${fighterObj.range}</td>
							<td class="${classNames.fighterCost}">${fighterObj.op_cost}</td>
						</tr>`;
				return markup;
			})
			.join("");

		return [markup, localParent];
	}
}
// DONT FORGET TO CALL IT
export default new FighterPopUpTable();
