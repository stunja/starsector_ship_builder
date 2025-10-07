import classNames from "../../helper/DomClassNames.js";
import DataSet from "../../helper/DataSet.js";
// View
import View from "../view.js";
import WeaponSpriteView from "../Weapons/WeaponSpriteView.js";
import URL from "../../helper/url.js";
import { GENERIC_STRING } from "../../helper/MagicStrings.js";

const ALT_TEXT = {
	WEAPON_DAMAGE_TYPE: "weapon damage type",
};
class WeaponHoverContainerView extends View {
	_localParent = `.${classNames.hoverContainer}`;

	#information;
	#stats;
	#additionalStats;
	#string;
	#damageTypeEffect;
	#turnRateRating;
	#accuracyRating;

	#weaponObject;
	#weaponSlotObject;

	#processData() {
		const [weaponData, weaponObject, weaponSlotObject] = this._data;

		const {
			information,
			stats,
			additionalStats,
			string,
			damageTypeEffect,
			turnRateRating,
			accuracyRating,
		} = weaponData;

		this.#information = information;
		this.#stats = stats;
		this.#additionalStats = additionalStats;
		this.#string = string;
		this.#damageTypeEffect = damageTypeEffect;
		this.#turnRateRating = turnRateRating;
		this.#accuracyRating = accuracyRating;

		this.#weaponObject = weaponObject;
		this.#weaponSlotObject = weaponSlotObject;
	}
	generateMarkup() {
		this.#processData(this._data);

		return this.#containerRender();
	}

	async #containerRender() {
		const primaryMarkup = await this.#primaryDataMarkup();
		const markup = `	
			<ul>
				${this.#introDataMarkup()}
				<li class="weapon-divider"><p>Primary Data</p></li>
				${primaryMarkup}
				<li class="weapon-divider"><p>Anciliary Data</p></li>
				${this.#anciliaryDataMarkup()}
			</ul>
		`;

		return markup;
	}

	#introDataMarkup() {
		return `
			<li class="weapon-name">
				<p>Weapon Name</p>
				<p>${this.#information.name}</p>
			</li>
			<li class="${classNames.weaponDescription}">
				<p>${this.#string.shortWeaponDescription}.</p>
			</li>
			`;
	}

	async #primaryDataMarkup() {
		//! Here
		const weaponIconRender = await WeaponSpriteView.renderElement([
			this.#weaponObject,
			this.#weaponSlotObject,
		]);

		const primaryIconMarkup = `
				<div class="weapon-primary-data__icon">
					<li class="${classNames.weaponIcon} 
					${classNames.weaponSize}--${this.#stats.mount.size} 
					${classNames.weaponType}--${this.#stats.mount.type}" 
					data-id="${this.#information.id}"
					>
						${weaponIconRender}
					</li>
		      	</div>`;

		const weaponContentGroupMarkup = `
					<div class="${classNames.weaponContentGroup}">
						${this.#contentMarkup("Range", this.#stats.range)}
						${
							!this.#additionalStats.isWeaponBeam
								? this.#contentMarkup("Damage", this.#string.damageString)
								: ""
						}
						${this.#contentMarkup("Damage / sec", this.#additionalStats.damagePerSecond)}
					</div>
					`;

		const weaponMountTypeMarkup = `					
					<li class="${classNames.weaponMountType}">
						<p>Mount Type:</p>
						<div class="${classNames.textAlignRight}">
							<strong><p>${this.#stats.mount.type}</p></strong>
							<strong><p>${this.#stats.mount.size}</p></strong>
						</div>
					</li>
					`;

		const primaryContentMarkup = `
				<div class="weapon-primary-data_content">
					${this.#contentMarkup("Primary Role", this.#information.primaryRole)}
					${weaponMountTypeMarkup}
					${this.#contentMarkup("Ordinance Point", this.#information.op)}
					${weaponContentGroupMarkup}
					${this.#fluxMarkUp()}
				</div>`;

		return `
			<div class="d-grid ${classNames.weaponPrimaryData}">
				${primaryIconMarkup}
				${primaryContentMarkup}
			</div>`;
	}

	#anciliaryDataMarkup() {
		const weaponTypeString = this.#stats.projectile.type
			.split("_")
			.join(GENERIC_STRING.EMPTY)
			.toLowerCase();

		const damageTypeMarkup = this.#damageTypeEffect()
			.map((str) => `<strong><p>${str}</p></strong>`)
			.join(GENERIC_STRING.EMPTY);

		return `<div class="d-grid weapon-anciliary-data">
					<div class="weapon-anciliary-data__icon-parent">
						<li class="weapon-anciliary-data__icon">
							${this.#weaponTypeSprite(this.#weaponObject)}
						</li>
					</div>
					<div class="weapon-primary-data_content">
						<li class="${classNames.weaponDamageType}">
							<p>Damage Type:</p>
							<div class="${classNames.textAlignRight}">
								<strong><p>${weaponTypeString}</p></strong>
								${damageTypeMarkup}
							</div>
						</li>
						${this.#contentMarkup("Accuracy", this.#accuracyRating())}
						${this.#contentMarkup("Turn rate", this.#turnRateRating())}

						${
							this.#stats.ammo.burstSize < 2 || !this.#stats.ammo.burstSize
								? GENERIC_STRING.EMPTY
								: this.#contentMarkup("Burst Size", this.#stats.ammo.burstSize)
						}
						${
							this.#stats.ammo.capacity
								? this.#contentMarkup("Ammo Size", this.#stats.ammo.capacity)
								: GENERIC_STRING.EMPTY
						}
						${
							this.#stats.ammo.capacity
								? this.#contentMarkup(
										"Ammo Per Sec",
										this.#stats.ammo.perSecond
								  )
								: GENERIC_STRING.EMPTY
						}

						${this.#contentMarkup("Refire delay", this.#string.refireDelayString)}
					</div>
				</div>`;
	}
	#contentMarkup = (str, data) => {
		return `
				<li>
					${str !== GENERIC_STRING.EMPTY ? `<p>${str}</p>` : GENERIC_STRING.EMPTY}
					<strong><p>${data}</p></strong>
				</li>`;
	};
	#fluxMarkUp = () => {
		const fluxPerShotMarkup = this.#stats.flux.perShot
			? `${this.#contentMarkup("Flux / shot", this.#stats.flux.perShot)}`
			: GENERIC_STRING.EMPTY;

		const fluxPerSecondMarkup = this.#additionalStats.fluxPerSecond
			? `${this.#contentMarkup(
					"Flux / sec",
					this.#additionalStats.fluxPerSecond
			  )}`
			: GENERIC_STRING.EMPTY;

		const fluxPerDamageMarkup = this.#additionalStats.fluxPerDamage
			? `${this.#contentMarkup(
					"Flux / damage",
					this.#additionalStats.fluxPerDamage
			  )}`
			: GENERIC_STRING.EMPTY;

		const markup = `
				${fluxPerSecondMarkup}
				${fluxPerShotMarkup}
				${fluxPerDamageMarkup}`;
		return markup;
	};
	#weaponTypeSprite(weaponObject) {
		const editedString = weaponObject.type.toLowerCase();
		const targetFile = `damagetype_${editedString}.png`;
		return `<img src="/${URL.UI_ICONS}/${targetFile}" alt="${ALT_TEXT.WEAPON_DAMAGE_TYPE}" class="${classNames.weaponDamageType}"/>`;
	}
}
export default new WeaponHoverContainerView();
