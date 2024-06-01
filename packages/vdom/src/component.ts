import type { VNode, VNodeChildren } from "./vnode";

export type Component<Props extends Record<string, unknown>> = (
	props: Props,
	children: VNodeChildren,
) => VNode;
