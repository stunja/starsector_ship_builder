class SearchView {
	#parentElement = document.querySelector(".build-maker__nav");

	getInputValue = () => {
		const inputValue = this.#parentElement.querySelector(
			".search-form__input"
		).value;
		// this.#clearInput(); //
		return inputValue;
	};

	render() {
		if (!this.#parentElement) this.#assignParentElement();
		const markup = `   
            <a href="#" class="logo nav_logo">Ship Builder</a>

            <form class="search-form">
                <input
                    type="text"
                    id="search-nav-top"
                    class="search-form__input"
                    placeholder="Enter the name of the ship"
                    value="astral"
                    required
                />

                <button type="submit" class="button search-form__button">Search</button>
            </form>

            <button class="button">Saved Builds</button>
        `;
		this.#clearRender(this.#parentElement);
		this.#parentElement.insertAdjacentHTML("afterbegin", markup);
	}
	#clearInput() {
		this.#parentElement.querySelector(".search-form__input").value = "";
	}
	addSearchHandler(inputFunction) {
		this.#parentElement.addEventListener("submit", function (e) {
			e.preventDefault();
			inputFunction();
		});
	}
	#assignParentElement() {
		this.#parentElement = document.querySelector(".build-maker__nav");
	}
	#clearRender = (parentElement) => (parentElement.innerHTML = "");

	//   addHandlerClick(handler) {
	//     this._parentElement.addEventListener('click', function (e) {
	//       const btn = e.target.closest('.btn--inline');
	//       if (!btn) return;

	//       const goToPage = +btn.dataset.goto;
	//       handler(goToPage);
	//     });

	//   }
}
export default new SearchView();
