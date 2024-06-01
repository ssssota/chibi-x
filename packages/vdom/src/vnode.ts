import type { App } from "./app";
import type { Component } from "./component";
export type VNodeType<Props extends Record<string, unknown>> =
	| Component<Props>
	| string;
export type VNodeChildren = (string | VNode)[];
export type VNode = {
	// biome-ignore lint/suspicious/noExplicitAny: all props are unknown
	type: VNodeType<any>;
	props: Record<string, unknown>;
	children: VNodeChildren;
	_app?: App;
};
