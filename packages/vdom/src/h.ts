import type { VNode, VNodeType } from "./vnode";

export function h<Props extends Record<string, unknown>>(
	type: VNodeType<Props>,
	props: Props,
	children: (string | VNode)[],
): VNode {
	return { type, props, children };
}
