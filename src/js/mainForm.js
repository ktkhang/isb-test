const selectLocation = new Select('select-location');
const selectPropStatis = new Select('select-prop-status');
const selectPropType = new Select('select-prop-type');

const price = new RangeSlider('input-price', {
	min: 100,
	max: 6000,
});
const area = new RangeSlider('input-area', {
	min: 1500,
	max: 22000,
});

const selectMinBeds = new Select('select-min-beds');
const selectMinBaths = new Select('select-min-baths');

const checkboxCentralHeating = new Checkbox('checkbox-central-heating');
const checkbox2 = new Checkbox('checkbox-2');
const checkboxHurricaneShutters = new Checkbox('checkbox-hurricane-shutters');

const featuresCollapeContainer = document.getElementById(
	'group-features-collapse'
);
if (featuresCollapeContainer) {
	const toggler = featuresCollapeContainer.querySelector('.toggler');
	const collapse = featuresCollapeContainer.querySelector('.collapse');
	if (toggler && collapse) {
		toggler.addEventListener('click', () => {
			featuresCollapeContainer.classList.toggle('open');
		});
	}
}
