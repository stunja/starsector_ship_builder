// import classNames from "../../helper/DomClassNames.js";
// import URL from "../../helper/url.js";

// //! is this even working?
// class FighterSpritesView {
// 	render(currentFighterObject) {
// 		//! not working
// 		console.log("test");
// 		const markup = `
// 					<div class="${classNames.weaponSpriteParent}">
// 						<div class="${classNames.fighterSpriteContainer}">
//                             ${this.#fighterArrayMarkup(currentFighterObject)}
// 						</div>
// 						${this.#fighterCostMarkup(currentFighterObject)}
// 					</div>`;
// 		return markup;
// 	}

// 	// Draw the sprite | Sprites can be drawn up to 6 in the same component
// 	// I then use CSS to position them correctly.
// 	#fighterSpriteMarkup = (fighterNumber, fighterMax, currentWeaponSprite) => {
// 		const spriteLocation = `./${URL.DATA}/${currentWeaponSprite}`;
// 		return `<img src="${spriteLocation}" alt="fighter sprite" class="${classNames.fighterSprite} ${classNames.fighterSprite}--${fighterNumber} ${classNames.fighterSpritesMax}--${fighterMax}" />`;
// 	};

// 	// Draw sprites equal to number of fighters
// 	#fighterArrayMarkup = (currentFighterObject) => {
// 		// Create an Array from a number, and inject Single fighterSprites equal to fighter Num (wing size)
// 		return Array.from(
// 			{ length: currentFighterObject.num },
// 			(_, i) =>
// 				`${this.#fighterSpriteMarkup(
// 					i + 1,
// 					currentFighterObject.num,
// 					currentFighterObject.additionalFighterData.spriteName
// 				)}`
// 		).join("");
// 	};

// 	#fighterCostMarkup = (currentFighterObject) => {
// 		console.log(currentFighterObject.op_cost);
// 		return `<p class="${classNames.fighterSpriteCost}">${currentFighterObject.op_cost}</p>`;
// 	};

// 	async #weaponSpriteMarkupAsync(wpnObject) {
// 		if (!wpnObject) return Promise.resolve(GENERIC_STRING.EMPTY);

// 		const loadImage = (src) => {
// 			return new Promise((resolve, reject) => {
// 				const img = new Image();
// 				img.src = `/${URL.DATA}/${src}`;
// 				img.onload = () => resolve(img);
// 				img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
// 			});
// 		};

// 		const { turretSprite, turretGunSprite } = wpnObject.additionalData;

// 		const promises = [
// 			loadImage(turretSprite),
// 			turretGunSprite ? loadImage(turretGunSprite) : Promise.resolve(null),
// 		];

// 		return Promise.all(promises).then(([turretImg, gunImg]) => {
// 			const turretHTML = turretImg
// 				? `<img src="${turretImg.src}" alt="${altTextLib.weaponBaseSprite}" class="${classNames.weaponSpriteBase}" />`
// 				: GENERIC_STRING.EMPTY;

// 			const gunHTML = gunImg
// 				? `<img src="${gunImg.src}" alt="${altTextLib.turrentGunSprite}" class="${classNames.weaponSpriteGun}" />`
// 				: GENERIC_STRING.EMPTY;

// 			return `
// 			<div class="${classNames.weaponSprite}">
// 				${turretHTML}
// 				${gunHTML}
// 			</div>
// 		`;
// 		});
// 	}
// }
// export default new FighterSpritesView();
