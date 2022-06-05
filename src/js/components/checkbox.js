import BaseComponent from './base-component';
import { icCheckbox } from '../constants';

const MAIN_CLASS = 'checkbox';
const TEXT_CLASS = 'checkbox__content';
const CHECKBOX_CLASS = 'checkbox__check';

class Checkbox extends BaseComponent {
	constructor(element) {
		super(element);
		this._text = this._element?.title || '';
		this._checked = this._element?.checked || false;
		this._init();
	}

	_init() {
		if (!this._element) return;
		this._container = document.createElement('label');
		this._container.className = MAIN_CLASS;
		this._container.title = this._text;

		const icCheck = document.createElement('src-loader');
		icCheck.setAttribute('src', icCheckbox);

		const displayCheckbox = document.createElement('span');
		displayCheckbox.className = CHECKBOX_CLASS;
		displayCheckbox.appendChild(icCheck);

		const textElm = document.createElement('span');
		textElm.className = TEXT_CLASS;
		textElm.textContent = this._text;

		const input = this._element.cloneNode(true);
		input.addEventListener('change', (e) => {
			this._checked = e.target.checked;
			if (this._checked) {
				this._container.classList.add('checked');
			} else {
				this._container.classList.remove('checked');
			}
		});

		this._container.appendChild(input);
		this._container.appendChild(displayCheckbox);
		this._container.appendChild(textElm);
		if (this._checked) {
			this._container.classList.add('checked');
		}

		this._element.parentNode.replaceChild(this._container, this._element);
	}

	getChecked() {
		return this._checked;
	}
}

window.Checkbox = Checkbox;
export default Checkbox;
