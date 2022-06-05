// header
const HEADER_TOGGLER_CLASS = 'header__toggle-menu';
const HEADER_DROPDOWN_CONTENT_CLASS = 'header__content';
const HEADER_DROPDOWN_ITEM_CLASS = 'header__menu-bar--item';

let togglerMenuHeader;
let menuContentHeader;
let menuItems = [];

const onClickMenuDropdown = (e) => {
	if (
		!e.target.classList.contains('dropdown-container') &&
		!e.target.classList.contains('toggler')
	) {
		menuContentHeader.classList.remove('open');
	}
};
const onClickHeaderToggler = () => {
	togglerMenuHeader.scrollIntoView({
		behavior: 'smooth',
	});
	if (!menuContentHeader.classList.contains('open')) {
		document.body.classList.add('overflow-hidden');
		menuContentHeader.classList.add('open');
	} else {
		menuContentHeader.classList.remove('open');
		document.body.classList.remove('overflow-hidden');
	}
};

const allLinks = document.querySelectorAll('a');
const allLinksArray = Array.from(allLinks);
allLinksArray.forEach((link) => {
	link.addEventListener('click', (e) => {
		document.body.classList.remove('overflow-hidden');
	});
});

const run = () => {
	const windowWidth =
		window.innerWidth || document.documentElement.clientWidth;
	if (windowWidth > 768) return;
	togglerMenuHeader = document.querySelector(`.${HEADER_TOGGLER_CLASS}`);
	menuContentHeader = document.querySelector(
		`.${HEADER_DROPDOWN_CONTENT_CLASS}`
	);

	if (togglerMenuHeader && menuContentHeader) {
		togglerMenuHeader.addEventListener('click', onClickHeaderToggler);

		menuItems = menuContentHeader.querySelectorAll(
			`.${HEADER_DROPDOWN_ITEM_CLASS}`
		);

		menuItems.forEach((item) => {
			item.addEventListener('click', onClickMenuDropdown);
		});
	}
};

document.addEventListener('DOMContentLoaded', (e) => {
	window.addEventListener('resize', (e) => {
		if (togglerMenuHeader) {
			togglerMenuHeader.removeEventListener('click', onClickHeaderToggler);
		}
		if (menuItems?.length) {
			menuItems.forEach((item) => {
				item.removeEventListener('click', onClickMenuDropdown);
			});
		}
		run();
	});
	run();
});
