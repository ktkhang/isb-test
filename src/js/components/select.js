import BaseComponent from './base-component';
import { icDown } from '../constants';

const MAIN_CLASS = 'select';
const TITLE_CLASS = 'select__title';
const LIST_CLASS = 'select__list animated';
const CHEVRON_CLASS = 'select__chevron';
const SELECTED_CLASS = 'is-selected';
const OPEN_CLASS = 'is-open';

class Select extends BaseComponent {
	constructor(element) {
		super(element);
		this._selectOptions = this._element.options || [];
		this._optionsLength = this._selectOptions.length;
		this._index = 0;
		this._init();
	}

	_init() {
		if (!this._element) return;
		this._selectContainer = document.createElement('div');
		this._selectContainer.className = MAIN_CLASS;

		if (this._element?.id) {
			this._selectContainer.id = this._element.id;
		}

		this._button = document.createElement('button');

		this._button.className = TITLE_CLASS;
		this._button.textContent = this._selectOptions[0]?.textContent || '';
		this._value = this._selectOptions[0]?.value || '';

		const chevron = document.createElement('img');
		chevron.setAttribute('src', icDown);
		chevron.setAttribute('class', `${CHEVRON_CLASS} img-svg`);
		this._selectContainer.appendChild(chevron);

		this._ul = document.createElement('ul');
		this._ul.className = LIST_CLASS;

		this._generateOptions(this._selectOptions);

		this._selectContainer.appendChild(this._button);
		this._selectContainer.appendChild(this._ul);

		this._selectContainer.addEventListener('click', this._onClick);

		this._element.parentNode.insertBefore(
			this._selectContainer,
			this._element
		);
		this._element.style.display = 'none';

		document.addEventListener('click', (e) => {
			if (!this._selectContainer.contains(e.target)) this.close();
		});
	}

	_generateOptions(options = []) {
		for (let i = 0; i < options.length; i++) {
			const li = document.createElement('li');

			li.innerText = options[i]?.textContent || '';
			li.setAttribute('data-value', options[i].value);
			li.setAttribute('data-index', this._index++);

			if (
				this._selectOptions[this._element.selectedIndex].textContent ===
				options[i].textContent
			) {
				li.classList.add(SELECTED_CLASS);
				this._button.textContent = options[i].textContent;
				this._value = options[i].value;
			}

			this._ul.appendChild(li);
		}
	}

	_onClick = (e) => {
		e.preventDefault();
		const t = e.target;

		if (t.className === TITLE_CLASS) {
			this.toggle();
		}

		if (t.tagName === 'LI') {
			this._selectContainer.querySelector('.' + TITLE_CLASS).innerText =
				t.innerText;
			this._element.options.selectedIndex = t.getAttribute('data-index');

			const evt = new CustomEvent('change');
			this._element.dispatchEvent(evt);
			this._value = evt.target.value;

			for (let i = 0; i < this._optionsLength; i++) {
				this._ul.querySelectorAll('li')[i].classList.remove(SELECTED_CLASS);
			}
			t.classList.add(SELECTED_CLASS);

			this.close();
		}
	};

	close() {
		this._ul.classList.remove(OPEN_CLASS, 'fadeInAndOut');
		this._selectContainer.classList.remove(OPEN_CLASS);
	}

	open() {
		this._ul.classList.add(OPEN_CLASS, 'fadeInAndOut');
		this._selectContainer.classList.add(OPEN_CLASS);
	}

	toggle() {
		if (this._ul.classList.contains(OPEN_CLASS)) {
			this.close();
		} else {
			this.open();
		}
	}

	getValue() {
		return this._value;
	}
}

window.Select = Select;
export default Select;
