import type { VNode } from "./vnode";

function render(node: string | VNode): Node {
	if (typeof node === "string") {
		return document.createTextNode(node);
	}

	const el = document.createElement(node.tag);
	for (const [key, value] of Object.entries(node.props)) {
		if (key.startsWith("on")) {
			// @ts-ignore
			el.addEventListener(key.slice(2).toLowerCase(), value);
		} else {
			el.setAttribute(key, String(value));
		}
	}
	for (const child of node.children) {
		el.appendChild(render(child));
	}
	return el;
}

export function createApp(root: VNode) {
	return {
		mount(target: HTMLElement) {
			target.appendChild(render(root));
		},
	};
}
