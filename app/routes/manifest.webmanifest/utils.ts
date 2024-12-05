export let linkColor = "#e53a40";

let uniqueIconSizes = new Set([
	32, 57, 72, 96, 120, 128, 144, 152, 195, 228, 512,
]);

export let iconSizes = [...uniqueIconSizes].map((size) => {
	return {
		src: `/logo-${size}.png`,
		sizes: `${size}x${size}`,
	};
});
