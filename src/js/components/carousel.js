import BaseComponent from './base-component';

const CAROUSEL_CONTENT_CLASS = 'carousel__content';
const CAROUSEL_ITEM = 'carousel__slide';
const BTN_PREV_CLASS = 'carousel__navigator--prev';
const BTN_NEXT_CLASS = 'carousel__navigator--next';

class Carousel extends BaseComponent {
	static DEFAULT_SETTINGS = {
		displaying: 1,
		autoplay: true,
		slideInterval: 5000,
	};

	constructor(element, options) {
		super(element);
		this._carouselDisplaying = options?.displaying || 1;
		this._settings = {
			...Carousel.DEFAULT_SETTINGS,
			...(options || {}),
			displaying: this._carouselDisplaying,
		};
		this._start();
	}

	_start() {
		if (!this._element) return;
		this._carouselContent = this._element.querySelector(
			`.${CAROUSEL_CONTENT_CLASS}`
		);
		const slides = this._element.querySelectorAll(`.${CAROUSEL_ITEM}`);
		this._arrayOfSlides = Array.prototype.slice.call(slides);
		if (this._arrayOfSlides.length === this._carouselDisplaying) {
			const clonedSlides = [];
			slides.forEach((node) => {
				const cloned = node.cloneNode(true);
				this._arrayOfSlides.push(cloned);
				this._carouselContent.appendChild(cloned);
			});
		}
		document.addEventListener('DOMContentLoaded', (e) => {
			this._moveSlidesRight();
			window.addEventListener('resize', this._setScreenSize);
			this._setScreenSize();
			this._moving = true;

			if (this._settings.wheel) {
				this._carouselContent.addEventListener(
					'mousedown',
					this._seeMovement
				);
			}

			const btnPrev = this._element.querySelector(`.${BTN_PREV_CLASS}`);
			const btnNext = this._element.querySelector(`.${BTN_NEXT_CLASS}`);
			if (btnPrev && btnNext) {
				btnPrev.addEventListener('click', this._moveRight);
				btnNext.addEventListener('click', this._moveLeft);
			}

			this._startAutoplay();
		});
	}

	_startAutoplay() {
		if (this._settings.autoplay) {
			this._interval && clearInterval(this._interval);
			this._interval = setInterval(
				this._moveLeft,
				this._settings.slideInterval
			);
		}
	}

	_addClone = () => {
		const lastSlide = this._carouselContent.lastElementChild.cloneNode(true);
		lastSlide.style.left = -this._lengthOfSlide + 'px';
		this._carouselContent.insertBefore(
			lastSlide,
			this._carouselContent.firstChild
		);
	};

	_removeClone = () => {
		const firstSlide = this._carouselContent.firstElementChild;
		firstSlide.parentNode.removeChild(firstSlide);
	};

	_moveSlidesRight = () => {
		const slides = this._element.querySelectorAll(`.${CAROUSEL_ITEM}`);
		let slidesArray = Array.prototype.slice.call(slides);
		let width = 0;

		slidesArray.forEach((el, i) => {
			el.style.left = width + 'px';
			width += this._lengthOfSlide;
		});
		this._addClone();
	};

	_moveSlidesLeft = () => {
		const slides = this._element.querySelectorAll(`.${CAROUSEL_ITEM}`);
		let slidesArray = Array.prototype.slice.call(slides);
		slidesArray = slidesArray.reverse();
		let maxWidth = (slidesArray.length - 1) * this._lengthOfSlide;

		slidesArray.forEach((el, i) => {
			maxWidth -= this._lengthOfSlide;
			el.style.left = maxWidth + 'px';
		});
	};

	_setScreenSize = () => {
		this._carouselDisplaying = this._settings.displaying;

		if (window.innerWidth < 768) {
			if (this._carouselDisplaying > 1) {
				this._carouselDisplaying = 2;
			}
			if (window.innerWidth < 576) {
				this._carouselDisplaying = 1;
			}
		}
		this._getScreenSize();
	};

	_getScreenSize = () => {
		const slides = this._element.querySelectorAll(`.${CAROUSEL_ITEM}`);
		const slidesArray = Array.prototype.slice.call(slides);
		this._lengthOfSlide =
			this._element.offsetWidth / this._carouselDisplaying;
		let initialWidth = -this._lengthOfSlide;
		slidesArray.forEach((el) => {
			el.style.width = this._lengthOfSlide + 'px';
			el.style.left = initialWidth + 'px';
			initialWidth += this._lengthOfSlide;
		});
	};

	_moveRight = () => {
		if (this._moving) {
			this._moving = false;
			const lastSlide = this._carouselContent.lastElementChild;
			lastSlide.parentNode.removeChild(lastSlide);
			this._carouselContent.insertBefore(
				lastSlide,
				this._carouselContent.firstChild
			);
			this._removeClone();
			const firstSlide = this._carouselContent.firstElementChild;
			firstSlide.addEventListener('transitionend', this._activateAgain);
			this._moveSlidesRight();
			this._startAutoplay();
		}
	};

	_activateAgain = () => {
		const firstSlide = this._carouselContent.firstElementChild;
		this._moving = true;
		firstSlide.removeEventListener('transitionend', this._activateAgain);
	};

	_moveLeft = () => {
		if (this._moving) {
			this._moving = false;
			this._removeClone();
			const firstSlide = this._carouselContent.firstElementChild;
			firstSlide.addEventListener('transitionend', this._replaceToEnd);
			this._moveSlidesLeft();
			this._startAutoplay();
		}
	};

	_replaceToEnd = () => {
		const firstSlide = this._carouselContent.firstElementChild;
		firstSlide.parentNode.removeChild(firstSlide);
		this._carouselContent.appendChild(firstSlide);
		firstSlide.style.left =
			(this._arrayOfSlides.length - 1) * this._lengthOfSlide + 'px';
		this._addClone();
		this._moving = true;
		firstSlide.removeEventListener('transitionend', this._replaceToEnd);
	};

	_seeMovement = (e) => {
		this._interval && clearInterval(this._interval);
		this._initialX = e.clientX;
		this._getInitialPos();
		if (this._settings.wheel) {
			this._carouselContent.addEventListener('mousemove', this._slightMove);
			document.addEventListener('mouseup', this._moveBasedOnMouse);
		}
		setTimeout(() => {
			this._startAutoplay();
		}, this._settings.slideInterval);
	};

	_slightMove = (e) => {
		if (this._moving) {
			let movingX = e.clientX;
			let difference = this._initialX - movingX;
			if (Math.abs(difference) < this._lengthOfSlide / 4) {
				this._slightMoveSlides(difference);
			}
		}
	};

	_getInitialPos = () => {
		const slides = this._element.querySelectorAll(`.${CAROUSEL_ITEM}`);
		const slidesArray = Array.prototype.slice.call(slides);
		this._initialPos = [];
		slidesArray.forEach((el) => {
			const left = Math.floor(parseInt(el.style.left.slice(0, -2)));
			this._initialPos.push(left);
		});
	};

	_slightMoveSlides = (newX) => {
		const slides = document.querySelectorAll(`.${CAROUSEL_ITEM}`);
		const slidesArray = Array.prototype.slice.call(slides);
		slidesArray.forEach((el, i) => {
			const oldLeft = this._initialPos[i];
			el.style.left = oldLeft - newX + 'px';
		});
	};

	_moveBasedOnMouse = (e) => {
		let finalX = e.clientX;
		if (this._initialX - finalX > 0) {
			this._moveLeft();
		} else if (this._initialX - finalX < 0) {
			this._moveRight();
		}
		if (this._settings.wheel) {
			document.removeEventListener('mouseup', this._moveBasedOnMouse);
			this._carouselContent.removeEventListener(
				'mousemove',
				this._slightMove
			);
		}
		this._startAutoplay();
	};
}

class CarouselManager {
	constructor() {
		this._carousels = new Map();
	}

	start(carouselRoots) {
		if (carouselRoots?.length) {
			carouselRoots.forEach(({ element, options }) => {
				const carousel = new Carousel(element, options);
				this._carousels.set(element, carousel);
			});
		}
	}
}
const CarouselEngine = new CarouselManager();
export default CarouselEngine;
