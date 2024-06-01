import type { VNode } from "./vnode";

export type Component<Props extends Record<string, unknown>> = (
	props: Props,
) => VNode;
