import type { Component } from "./component";
import { patch } from "./patch";
import type { VNode } from "./vnode";

export function createApp<Props extends Record<string, unknown>>(
	root: Component<Props>,
) {
	let _target: HTMLElement;
	let _prev: VNode;
	function rerender(props: Props) {
		const vnode = root(props);
		patch(_target, _prev, vnode);
		_prev = vnode;
	}
	return {
		mount(target: HTMLElement, props: Props) {
			_target = target;
			rerender(props);
		},
		rerender,
	};
}
