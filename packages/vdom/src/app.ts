import type { VNode } from "./vnode";

function render(node: string | VNode): string {
	if (typeof node === "string") return node;

	return `<${node.tag} ${Object.entries(node.props)
		.map(([key, value]) => `${key}=${JSON.stringify(String(value))}`)
		.join(" ")}>${node.children.map(render).join("")}</${node.tag}>`;
}

export function createApp(root: VNode) {
	return {
		mount(target: HTMLElement) {
			target.innerHTML = render(root);
		},
	};
}
