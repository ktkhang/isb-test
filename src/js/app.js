import './components';
import './mainForm';
import './responsive';
import CarouselEngine from './components/carousel';
import SlideShowEngine from './components/slideshow';

if (module.hot) {
	module.hot.accept();
}

SlideShowEngine.start([
	{
		element: 'main-slideshow',
		options: {},
	},
]);

CarouselEngine.start([
	{
		element: 'staffs-carousel',
		options: {
			displaying: 4,
		},
	},
	{
		element: 'testimonials-carousel',
		options: {
			displaying: 3,
			wheel: true,
		},
	},
]);

window.addEventListener('load', () => {
	if (navigator && navigator.serviceWorker) {
		navigator.serviceWorker.register('sw.js').then((registration) => {
			if (registration.installing) {
				console.log('Service worker installing');
			} else if (registration.waiting) {
				console.log('Service worker installed');
			} else if (registration.active) {
				console.log('Service worker active');
			}
		})
		.catch((e) => {
			console.log('Service worker registration failed. Error: ' + e);
		});
	}
});