export function createApp(root: string) {
	return {
		mount(target: HTMLElement) {
			target.innerHTML = root;
		},
	};
}
