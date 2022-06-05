import BaseComponent from './base-component';

const CONTAINER_CLASS = 'range-slider';
const INPUT_CONTAINER_CLASS = 'range-slider__input-container';
const RANGE_CLASS = 'range-slider__range';
const RANGE_INDICATOR_CLASS = 'range-slider__range--indicator';
const RANGE_BTN_START = 'range-slider__range--start';
const RANGE_BTN_END = 'range-slider__range--end';

const getPxNumber = (str) => Number(str.replace('px', ''));

class RangeSlider extends BaseComponent {
	static DEFAULT_SETTINGS = {
		min: 0,
		max: 100,
	};
	static BTN_SIZE = 16;

	constructor(element, options) {
		super(element);
		this._settings = {
			...RangeSlider.DEFAULT_SETTINGS,
			...(options || {}),
		};
		this._init();
	}

	_init() {
		if (!this._element) return;
		const sliderContainer = document.createElement('div');
		sliderContainer.className = this._element.className;
		sliderContainer.classList.add(CONTAINER_CLASS);

		// input container
		const inputContainer = document.createElement('div');
		inputContainer.className = INPUT_CONTAINER_CLASS;

		this._inputStart = document.createElement('input');
		this._inputStart.name = 'start';
		this._inputStart.value = this._settings.min;
		this._inputEnd = document.createElement('input');
		this._inputEnd.name = 'end';
		this._inputEnd.value = this._settings.max;
		const inputSeparator = document.createElement('span');
		inputSeparator.textContent = '-';

		inputContainer.appendChild(this._inputStart);
		inputContainer.appendChild(inputSeparator);
		inputContainer.appendChild(this._inputEnd);

		sliderContainer.appendChild(inputContainer);

		// slider
		const sliderRange = document.createElement('div');
		sliderRange.classList.add(RANGE_CLASS);

		const sliderRangeIndicator = document.createElement('div');
		sliderRangeIndicator.classList.add(RANGE_INDICATOR_CLASS);

		const sliderButtonStart = document.createElement('div');
		sliderButtonStart.role = 'button';
		sliderButtonStart.setAttribute('tabindex', '0');
		sliderButtonStart.style.height = `${RangeSlider.BTN_SIZE}px`;
		sliderButtonStart.style.width = `${RangeSlider.BTN_SIZE}px`;
		sliderButtonStart.classList.add(RANGE_BTN_START);
		sliderButtonStart.innerHTML = `<div style="position: relative; height: 100%; width: 100%;"><div style="position: absolute; height: 48px; width: 48px; top: 50%; left: 50%; transform: translateY(-50%) translateX(-50%);' +
			'"></div></div>`;

		const sliderButtonEnd = document.createElement('div');
		sliderButtonEnd.role = 'button';
		sliderButtonEnd.setAttribute('tabindex', '0');
		sliderButtonEnd.classList.add(RANGE_BTN_END);
		sliderButtonEnd.style.height = `${RangeSlider.BTN_SIZE}px`;
		sliderButtonEnd.style.width = `${RangeSlider.BTN_SIZE}px`;
		sliderButtonEnd.innerHTML = `<div style="position: relative; height: 100%; width: 100%;"><div style="position: absolute; height: 48px; width: 48px; top: 50%; left: 50%; transform: translateY(-50%) translateX(-50%);' +
			'"></div></div>`;

		sliderRange.appendChild(sliderRangeIndicator);
		sliderRange.appendChild(sliderButtonStart);
		sliderRange.appendChild(sliderButtonEnd);

		sliderContainer.appendChild(sliderRange);

		this._element.parentNode.insertBefore(
			sliderContainer,
			this._element.nextSibling
		);

		this._elementRange = sliderRange;
		this._buttonStart = sliderButtonStart;
		this._rangeIndicator = sliderRangeIndicator;
		this._element.type = 'hidden';

		this._inputValueEnd = document.createElement('input');
		this._inputValueEnd.hidden = true;
		this._inputValueEnd.name = this._element.name;
		this._element.parentNode.insertBefore(
			this._inputValueEnd,
			this._element.nextSibling
		);

		const rangeStart = this._settings.min;
		const rangeEnd = this._settings.max;

		document.addEventListener('DOMContentLoaded', (event) => {
			sliderButtonEnd.style.left =
				sliderRange.getBoundingClientRect().width -
				sliderButtonEnd.getBoundingClientRect().width +
				'px';

			this._buttonEnd = sliderButtonEnd;

			this._setRange(rangeStart, rangeEnd);
			this._refreshButtonPositions();
			this._refreshRangeIndicator();
			this._initEventSubscriptions();
		});
	}

	_initEventSubscriptions() {
		let previousWindowWidth = document.documentElement.clientWidth;

		window.addEventListener(
			'resize',
			(e) => {
				if (
					sliderEventSupporter.getActiveButton() === undefined ||
					previousWindowWidth !==
						document.documentElement.clientWidth.toFixed()
				) {
					previousWindowWidth =
						document.documentElement.clientWidth.toFixed();
					this._refreshButtonPositions();
					this._refreshRangeIndicator();
				}
			},
			{ passive: false }
		);

		const sliderEventSupporter = new SliderEventSupporter(
			this._buttonStart,
			this._buttonEnd
		);
		sliderEventSupporter.validateNewPosition = (button, positionX) => {
			return this._getValidX(button, positionX);
		};
		sliderEventSupporter.getPositionByValue = (button, valueX) => {
			return this._getXByValue(button, valueX);
		};
		sliderEventSupporter.onButtonPositionChanged = (
			button,
			forceInputChange = true
		) => {
			this._updateValues(forceInputChange);
			this._refreshRangeIndicator();
		};

		const handleInputChange = (input, value) => {
			const prevValue = this._rangeValue[0];
			if (!/^([0-9]|[0-9]\d+)$/.test(value)) {
				input.value = `${prevValue}`;
			} else {
				const currentMin =
					this._inputStart.value > this._settings.min
						? this._inputStart.value
						: this._settings.min;
				const currentMax =
					this._inputEnd.value < this._settings.max
						? this._inputEnd.value
						: this._settings.max;
				if (Number(value) < currentMin) {
					input.value = `${currentMin}`;
				} else if (Number(value) > currentMax) {
					input.value = `${currentMax}`;
				}
			}
			let ctrlButton =
				input.name === 'start' ? this._buttonStart : this._buttonEnd;
			sliderEventSupporter.onChange(ctrlButton, input.value);
		};
		[this._inputStart, this._inputEnd].forEach((input, idx) => {
			input.addEventListener('blur', (e) => {
				if (e.target.value != this._rangeValue[idx]) {
					handleInputChange(input, e.target.value);
				}
			});
			input.addEventListener('keydown', (e) => {
				if (e.keyCode === 13 && e.target.value != this._rangeValue[idx]) {
					handleInputChange(input, e.target.value);
				}
			});
		});
	}

	_updateValues(forceInputChange) {
		const rangePx =
			this._elementRange.offsetWidth -
			this._buttonStart.offsetWidth -
			this._buttonEnd.offsetWidth -
			1;
		const startPx = getPxNumber(this._buttonStart.style.left);
		const endPx =
			getPxNumber(this._buttonEnd.style.left) - this._buttonEnd.offsetWidth;

		const isFloat =
			parseFloat(this._settings.min) % 1 !== 0 ||
			parseFloat(this._settings.max) % 1 !== 0;

		const diffRange = this._settings.max - this._settings.min;
		let resultStart =
			(diffRange / rangePx) * startPx + parseFloat(this._settings.min);
		let resultEnd =
			(diffRange / rangePx) * endPx + parseFloat(this._settings.min);

		if (!isFloat) {
			resultStart = +Math.ceil(resultStart);
			resultEnd = +Math.ceil(resultEnd);
		}

		if (resultStart < this._settings.min) {
			resultStart = this._settings.min;
		} else if (resultStart > this._settings.max) {
			resultStart = this._settings.max;
		}
		if (resultEnd > this._settings.max) {
			resultEnd = this._settings.max;
		} else if (resultEnd < this._settings.min) {
			resultEnd = this._settings.min;
		}
		this._refreshRangeIndicator();

		this._setRange(resultStart, resultEnd, forceInputChange);
	}

	_getXByValue(button, valueX) {
		const rangePx =
			this._elementRange.offsetWidth -
			this._buttonStart.offsetWidth -
			this._buttonEnd.offsetWidth -
			1;
		const diffRange = this._settings.max - this._settings.min;
		const v = Number(valueX) - this._settings.min;
		const result = (rangePx * v) / diffRange;
		return result;
	}

	_getValidX(button, positionX) {
		let newX = positionX;

		if (button === this._buttonStart) {
			if (newX <= 0) {
				newX = 0;
			} else if (
				newX + this._buttonStart.getBoundingClientRect().width >=
				getPxNumber(this._buttonEnd.style.left)
			) {
				newX =
					getPxNumber(this._buttonEnd.style.left) -
					this._buttonStart.getBoundingClientRect().width;
			}
		} else if (button === this._buttonEnd) {
			if (
				newX >=
				this._elementRange.getBoundingClientRect().width -
					this._buttonEnd.getBoundingClientRect().width
			) {
				newX =
					this._elementRange.getBoundingClientRect().width -
					this._buttonEnd.getBoundingClientRect().width;
			} else if (
				newX <=
				this._buttonStart.getBoundingClientRect().width +
					getPxNumber(this._buttonStart.style.left)
			) {
				newX =
					this._buttonStart.getBoundingClientRect().width +
					getPxNumber(this._buttonStart.style.left);
			}
		}
		return newX;
	}

	_refreshButtonPositions() {
		const elementRangeWidth =
			this._elementRange.getBoundingClientRect().width;
		const buttonStartWidth = this._buttonStart.getBoundingClientRect().width;
		const buttonEndWidth = this._buttonEnd.getBoundingClientRect().width;

		const range = this._settings.max - this._settings.min;
		const factor =
			(elementRangeWidth - buttonStartWidth - buttonEndWidth) / range;

		const valueStart = this._rangeValue[0] - this._settings.min;
		const valueEnd = this._rangeValue[1] - this._settings.min;

		const buttonStartLeft = Math.floor(valueStart * factor);
		const buttonEndLeft = buttonStartWidth + Math.floor(valueEnd * factor);

		this._buttonStart.style.left = buttonStartLeft + 'px';
		this._buttonEnd.style.left = buttonEndLeft + 'px';
	}

	_refreshRangeIndicator() {
		const elementRangeWidth =
			this._elementRange.getBoundingClientRect().width;
		const buttonStartWidth = this._buttonStart.getBoundingClientRect().width;
		const buttonEndWidth = this._buttonEnd.getBoundingClientRect().width;

		const buttonStartMiddle = Math.round(
			getPxNumber(this._buttonStart.style.left) + buttonStartWidth / 2
		);
		const buttonEndMiddle = Math.round(
			elementRangeWidth -
				(getPxNumber(this._buttonEnd.style.left) + buttonEndWidth / 2)
		);
		this._rangeIndicator.style.left = buttonStartMiddle + 'px';
		this._rangeIndicator.style.right = buttonEndMiddle + 'px';
	}

	_setRange(start, end, forceInputChange = true) {
		this._rangeValue = [start, end];
		if (forceInputChange) {
			this._inputStart.value = start;
			this._inputEnd.value = end;
		}
		this._triggerRangeChangeEvent(this._rangeValue);
		this._element.value = this._rangeValue[0];
		this._inputValueEnd.value = this._rangeValue[1];
	}

	_triggerRangeChangeEvent(range) {
		const event = new CustomEvent('rangechange', {
			detail: this._rangeValue,
		});
		this._element.value = range ? range.join(',') : '';
		this._element.dispatchEvent(event);
	}

	getValue() {
		return [this._inputStart.value, this._inputEnd.value];
	}
}

class SliderEventSupporter {
	constructor(buttonStart, buttonEnd) {
		this._buttonStart = buttonStart;
		this._buttonEnd = buttonEnd;
		this._x = 0;
		this._activeButton = null;
		this._isMouseButtonDown = false;
		this._init();
	}

	_init() {
		this._buttonStart.addEventListener(
			'mousedown',
			this._handleButtonGrabbed,
			{
				passive: false,
			}
		);
		this._buttonStart.addEventListener(
			'touchstart',
			this._handleButtonGrabbed,
			{
				passive: false,
			}
		);
		this._buttonStart.addEventListener(
			'touchend',
			this._handleButtonRelease,
			{
				passive: false,
			}
		);
		this._buttonStart.addEventListener(
			'touchcancel',
			this._handleButtonRelease,
			{
				passive: false,
			}
		);
		this._buttonEnd.addEventListener('mousedown', this._handleButtonGrabbed, {
			passive: false,
		});
		this._buttonEnd.addEventListener(
			'touchstart',
			this._handleButtonGrabbed,
			{
				passive: false,
			}
		);
		this._buttonEnd.addEventListener('touchend', this._handleButtonRelease, {
			passive: false,
		});
		this._buttonEnd.addEventListener(
			'touchcancel',
			this._handleButtonRelease,
			{
				passive: false,
			}
		);

		window.addEventListener('mouseup', this._handleButtonRelease, {
			passive: false,
		});
		window.addEventListener('touchend', this._handleButtonRelease, {
			passive: false,
		});
		window.addEventListener('touchcancel', this._handleButtonRelease, {
			passive: false,
		});

		window.addEventListener('mousemove', this._handleButtonMove, {
			passive: false,
		});
		window.addEventListener('touchmove', this._handleButtonMove, {
			passive: false,
		});
		window.addEventListener(
			'mouseout',
			(e) => {
				if (e.toElement == null && e.relatedTarget == null) {
					this._handleButtonRelease(e);
				}
			},
			{ passive: false }
		);

		window.addEventListener('keydown', this._handleKeyDown, {
			passive: false,
		});
	}

	getActiveButton = () => {
		return this._activeButton;
	};

	validateNewPosition() {
		throw new Error('validateNewPosition() is not implemented');
	}
	getPositionByValue() {
		throw new Error('getPositionByValue() is not implemented');
	}

	onButtonPositionChanged() {
		throw new Error('onButtonPositionChanged() is not implemented');
	}

	onChange(button, percent) {
		const newPos = this.getPositionByValue(button, percent);
		button.style.left = newPos + 'px';
		this.onButtonPositionChanged(button, false);
	}

	_handleButtonGrabbed = (e) => {
		e.preventDefault();
		this._isMouseButtonDown = true;
		const buttonStartPosStart =
			this._buttonStart.getBoundingClientRect()?.left ?? void 0;
		const buttonEndPosStart =
			this._buttonEnd.getBoundingClientRect()?.left ?? void 0;
		let buttonStartPosEnd = void 0;
		let halfDistanceBetweenButtons = void 0;
		if (buttonStartPosStart && buttonEndPosStart) {
			buttonStartPosEnd =
				buttonStartPosStart +
				this._buttonStart.getBoundingClientRect().width;
			halfDistanceBetweenButtons =
				(buttonEndPosStart - buttonStartPosEnd) / 2;
		}

		if (
			halfDistanceBetweenButtons !== void 0 &&
			e.currentTarget === this._buttonEnd
		) {
			if (
				this._getXOfMoveEvent(e) <
				buttonStartPosEnd + halfDistanceBetweenButtons
			) {
				this._activeButton = this._buttonStart;
			} else {
				this._activeButton = this._buttonEnd;
			}
		} else {
			this._activeButton = e.currentTarget;
		}
		this._activeButton.focus();

		this._x = this._activeButton.offsetLeft - this._getXOfMoveEvent(e);
	};

	_handleButtonRelease = (e) => {
		this._isMouseButtonDown = false;
		if (!this._activeButton) return;

		this._x = this._activeButton.offsetLeft - this._getXOfMoveEvent(e);

		this._activeButton = void 0;
	};

	_handleButtonMove = (e) => {
		if (!this._activeButton || !this._isMouseButtonDown) return;

		e.preventDefault();
		e.stopImmediatePropagation();

		let newX = this._getXOfMoveEvent(e);

		newX = this.validateNewPosition(this._activeButton, newX + this._x);

		if (newX !== getPxNumber(this._activeButton.style.left)) {
			this._activeButton.style.left = newX + 'px';
			this.onButtonPositionChanged(this._activeButton);
		}
	};

	_handleKeyDown(e) {
		this._isMouseButtonDown = false;
		if (!document.activeElement) {
			return;
		}

		if (document.activeElement === this._buttonStart) {
			this._activeButton = this._buttonStart;
		} else if (document.activeElement === this._buttonEnd) {
			this._activeButton = this._buttonEnd;
		} else {
			return;
		}

		const arrowLeft = 37;
		const arrowRight = 39;

		let newX = 0;
		if (e.keyCode === arrowLeft) {
			newX = this.validateNewPosition(
				this._activeButton,
				this._activeButton.offsetLeft - 1
			);
		} else if (e.keyCode === arrowRight) {
			newX = this.validateNewPosition(
				this._activeButton,
				this._activeButton.offsetLeft + 1
			);
		} else {
			return;
		}

		e.preventDefault();

		this._activeButton.style.left = newX + 'px';
		this.onButtonPositionChanged(this._activeButton);
	}

	_getXOfMoveEvent = (e) => {
		if (
			e.type === 'touchstart' ||
			e.type === 'touchmove' ||
			e.type === 'touchend' ||
			e.type === 'touchcancel'
		) {
			const evt = !e.originalEvent ? e : e.originalEvent;
			const touch = evt.touches[0] || evt.changedTouches[0];

			return touch.pageX || touch.clientX;
		} else if (
			e.type === 'mousedown' ||
			e.type === 'mouseup' ||
			e.type === 'mousemove' ||
			e.type === 'mouseover' ||
			e.type === 'mouseout' ||
			e.type === 'mouseenter' ||
			e.type === 'mouseleave'
		) {
			return e.clientX;
		} else {
			return void 0;
		}
	};
}

window.RangeSlider = RangeSlider;
export default RangeSlider;
