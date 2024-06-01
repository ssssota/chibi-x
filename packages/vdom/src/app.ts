import type { Component } from "./component";
import { patch } from "./patch";
import type { VNode, VNodeChildren } from "./vnode";

export type App = {
	mount(
		target: Node,
		props: Record<string, unknown>,
		children?: VNodeChildren,
	): void;
	rerender(props: Record<string, unknown>, children?: VNodeChildren): void;
};

export function createApp<Props extends Record<string, unknown>>(
	root: Component<Props>,
): App {
	let _target: Node;
	let _prev: VNode;
	let _index = 0;
	function rerender(props: Props, children: VNodeChildren = []) {
		const vnode = root(props, children);
		patch(_target, _prev, vnode, _index);
		_prev = vnode;
	}
	return {
		mount(target: Node, props: Props, children: VNodeChildren = []) {
			_target = target;
			_index = _target.childNodes.length;
			rerender(props, children);
		},
		rerender,
	};
}
