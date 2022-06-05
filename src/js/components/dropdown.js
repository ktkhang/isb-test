const containers = document.querySelectorAll('.dropdown-container');

containers.forEach((container) => {
	const toggler = container.querySelector('.toggler');
	const dropdown = container.querySelector('.dropdown');

	if (toggler && dropdown) {
		toggler.addEventListener('click', () => {
			container.classList.toggle('open');
		});
	}
});

window.addEventListener('click', (e) => {
	const target = e.target;
	const container = target.closest('.dropdown-container');

	if (!container) {
		const dropdowns = document.querySelectorAll('.dropdown-container');

		dropdowns.forEach((dropdown) => {
			dropdown.classList.remove('open');
		});
	}
});
