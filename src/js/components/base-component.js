class BaseComponent {
	constructor(element) {
		this._element = this._getElement(element);
	}

	_getElement(opElement) {
		if (opElement && typeof opElement === 'string') {
			return document.getElementById(opElement);
		}
		return opElement;
	}
}

export default BaseComponent;
