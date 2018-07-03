setTimeout(() => {
	load.style.transition = "0.5s";
	load.style.opacity = "0";
	title.textContent = "Fertig"
	check.style.transition = "0.5s";
	check.style.opacity = "1";
	setTimeout(() => {
		loader.load(8);
	}, 500);
}, 2000);