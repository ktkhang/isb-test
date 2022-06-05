import BaseComponent from './base-component';

const SLIDE_ITEM_CLASS = 'slideshow__item';
const INDICATOR_ITEM_CLASS = 'slideshow__item--indicator';
const INDICATOR_CONTAINER_CLASS = 'slideshow__indicators';

class SlideShow extends BaseComponent {
	static DEFAULT_SETTINGS = {
		displaying: 1,
		autoplay: true,
		slideInterval: 5000,
		transitionDuration: 2500,
	};

	constructor(element, options) {
		super(element);
		this._carouselDisplaying = options?.displaying || 1;
		this._settings = {
			...SlideShow.DEFAULT_SETTINGS,
			...(options || {}),
			displaying: this._carouselDisplaying,
		};
		this._indicatorMap = new Map();
		this._counter = 0;
		this._start();
	}

	_start() {
		if (!this._element) return;

		const slides = this._element.querySelectorAll(`.${SLIDE_ITEM_CLASS}`);
		this._slides = Array.prototype.slice.call(slides);
		const indicatorContainer = this._element.querySelectorAll(
			`.${INDICATOR_CONTAINER_CLASS}`
		);

		document.addEventListener('DOMContentLoaded', (e) => {
			this._slides.forEach((slide, idx) => {
				slide.style.transitionDuration =
					this._settings.transitionDuration + 'ms';
			});
			if (indicatorContainer?.length) {
				const arr = this._slides.map((_, i) => i);
				arr.forEach((idx) => {
					const indicatorBtn = document.createElement('button');
					indicatorBtn.setAttribute('value', idx);
					indicatorBtn.setAttribute('class', INDICATOR_ITEM_CLASS);
					indicatorBtn.addEventListener('click', (e) => {
						this._showSlide(Number(e.target.value));
					});
					this._indicatorMap.set(idx, indicatorBtn);
					indicatorContainer[0].appendChild(indicatorBtn);
				});
			}

			this._startSlider();
		});
	}

	_startAutoplay() {
		if (this._settings.autoplay) {
			this._slideInterval && clearInterval(this._slideInterval);
			this._slideInterval = setInterval(
				this._nextSlide,
				this._settings.slideInterval
			);
		}
	}

	_showSlide(counter) {
		this._hideSlide();
		this._slides[counter].classList.add('active');
		this._startAutoplay();

		if (this._indicatorMap.has(counter)) {
			this._indicatorMap.get(counter).classList.add('active');
		}
	}

	_hideSlide() {
		this._slides.forEach((slide) => {
			slide.classList.remove('active');
		});
		this._indicatorMap.forEach((indicator) => {
			indicator.classList.remove('active');
		});
	}

	_nextSlide = () => {
		if (++this._counter === this._slides.length) {
			this._counter = 0;
		}

		this._showSlide(this._counter);
	};

	_prevSlide = () => {
		if (--this._counter === -1) {
			this._counter = this._slides.length - 1;
		}

		this._showSlide(this._counter);
	};

	_startSlider() {
		this._counter = 0;
		this._showSlide(this._counter);
	}
}

class SlideShowManager {
	constructor() {
		this._slides = new Map();
	}

	start(slideshowRoots) {
		if (slideshowRoots?.length) {
			slideshowRoots.forEach(({ element, options }) => {
				const slide = new SlideShow(element, options);
				this._slides.set(element, slide);
			});
		}
	}
}
const SlideShowEngine = new SlideShowManager();
export default SlideShowEngine;
