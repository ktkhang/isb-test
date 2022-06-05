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
