import type { VNode } from "./vnode";

export function h(
	tag: string,
	props: Record<string, unknown>,
	children: (string | VNode)[],
): VNode {
	return { tag, props, children };
}
