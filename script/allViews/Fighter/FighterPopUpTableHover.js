import View from "../view.js";
import classNames from "../../helper/DomClassNames.js";
//
//! Much cleaner implementation. I will use this component as a guide for full structure rework
class FighterPopUpTableHover extends View {
	// Helper method to create a single paragraph markup
	#createParagraph(text, isStrong = false) {
		return isStrong ? `<strong><p>${text}</p></strong>` : `<p>${text}</p>`;
	}

	// Helper method to create content markup
	#contentMarkUp(label, data) {
		return `
				<li>
					${label !== "" ? `${this.#createParagraph(label)}` : ""}
					${this.#createParagraph(data, true)}
				</li>`;
	}
	// Multy items content markup
	#contentMultyItems(str, data) {
		return `
				<li>
					${this.#createParagraph(str)}
					<div class="${classNames.fighterFlexColumn}">
						${data}
					</div>
				</li>`;
	}

	// Shorten description to first sentence
	#descriptionShrink(description) {
		return description.split(".").at(0) + ".";
	}

	// Find weapon or system name by ID
	#findNameById(id, collection) {
		const [currentItem] = collection.filter((obj) => obj.id === id);
		return currentItem ? currentItem.name : "[x]";
	}

	#fighterSystemMarkup(system_id, allWeapons) {
		return this.#findNameById(system_id, allWeapons);
	}

	#fighterWeaponsMarkUp(weaponGroups, allWeapons) {
		// Find Object
		const fighterWeapons = weaponGroups.flatMap((obj) =>
			Object.values(obj.weapons)
		);

		// Reduce it [Name, Amount]
		const condencedArray = fighterWeapons.reduce((acc, weapon) => {
			acc[weapon] = (acc[weapon] || 0) + 1;
			return acc;
		}, {});

		// Find a Name instead of Id
		const replaceStringIdWithProperString = (weaponId) => {
			const [currentWeapon] = allWeapons.filter(
				(weaponObject) => weaponObject.id === weaponId
			);

			return currentWeapon.name ? currentWeapon.name : currentWeapon.id;
		};

		const fighterWeaponString = Object.entries(condencedArray)
			.map((weapon) => {
				const weaponLabel = replaceStringIdWithProperString(weapon[0]);
				const weaponCount = weapon[1] > 1 ? `${weapon[1]}x ` : "";

				return `${this.#createParagraph(
					weaponCount + " " + weaponLabel,
					true
				)}`;
			})
			.join("");

		return fighterWeaponString;
	}

	#hullModsMarkUp(hullMods, allShipHulls) {
		const missingHullModName = "[x]";
		if (!hullMods) return `${this.#createParagraph(missingHullModName, true)}`;

		const extractedName = hullMods.map((currentMod) => {
			const [extractedHullModObject] = allShipHulls.filter(
				(hullMod) => hullMod.id === currentMod
			);
			return extractedHullModObject.name;
		});

		// Could return both array and empty array
		const isNameExistsAndNotEmpty =
			extractedName && extractedName.length > 0
				? extractedName
						.map((arr) => `${this.#createParagraph(arr, true)}`)
						.join("")
				: this.#createParagraph(missingHullModName, true);

		return isNameExistsAndNotEmpty;
	}

	hoverAdditionalInformationRender(fighterObject, allWeapons, allShipHulls) {
		const localParent = `.${classNames.hoverAdditionalInformation}`;
		const { role_desc, op_cost, range, num, refit, description } =
			fighterObject;

		const {
			name,
			shield_arc,
			tech_manufacturer,
			max_crew,
			hitpoints,
			armor_rating,
			shield_type,
			max_speed,
			system_id,
		} = fighterObject.additionalFighterDataShipHull;

		const { weaponGroups, hullMods } =
			fighterObject.additionalFighterDataFromVariant;

		// I dont remember why I remove class Like this.
		// Either Active Class, or Transparent class that wraps around the whole screen
		// document.querySelector(localParent).classList.remove(classNames.dNoneClass);

		const introContent = `
            ${this.#contentMarkUp("Fighter Name", name)}
            ${this.#contentMarkUp("Design Type", tech_manufacturer)}
        `;
		// prettier-ignore
		const mainContent = `
            <div class="${classNames.weaponContentGroup}">
                ${this.#contentMarkUp("Primary Role", role_desc)}
                ${this.#contentMarkUp("Ordnance Points", op_cost)}
                ${this.#contentMarkUp("Crew per Fighter", max_crew)}
                ${this.#contentMarkUp("Maximum engagement range", range)}
            </div>
            <div class="${classNames.weaponContentGroup}">
                ${this.#contentMarkUp("Fighters in wing", num)}
                ${this.#contentMarkUp("Base replacement time (seconds)", refit)}
                ${this.#contentMarkUp("Hull integrity", hitpoints)}
                ${this.#contentMarkUp("Armor rating", armor_rating)}
            </div>
            <div class="${classNames.weaponContentGroup}">
                ${shield_type !== "NONE" ? `
					${this.#contentMarkUp("Shield Type", shield_type)}
					${this.#contentMarkUp("Shield Arc", shield_arc)}
				`: ""}
                ${this.#contentMarkUp("Top speed", max_speed)}
                ${this.#contentMarkUp("System", this.#fighterSystemMarkup(system_id, allWeapons))}
                ${this.#contentMultyItems("HullMods", this.#hullModsMarkUp(hullMods, allShipHulls))}
            </div>
            <div class="${classNames.weaponContentGroup}">
                ${this.#contentMultyItems("Armaments",this.#fighterWeaponsMarkUp(weaponGroups, allWeapons))}
            </div>
        `;

		// prettier-ignore
		const markup = `
            <ul>
                ${introContent}
                <li class="${classNames.weaponDescription}">
                    ${this.#createParagraph(this.#descriptionShrink(description))}</p>
                </li>
                <li class="${classNames.weaponDivider}">
					${this.#createParagraph("Technical Data")}
				</li>
                ${mainContent}
            </ul>`;

		return [markup, localParent];
	}
}
export default new FighterPopUpTableHover();
