import type { Component } from "./component";
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

function patch(
	parent: Node,
	oldNode: VNode | string | undefined,
	newNode: VNode | string,
	index = 0,
) {
	if (oldNode === undefined) {
		parent.appendChild(render(newNode));
		return;
	}
	const el = parent.childNodes[index];
	if (typeof oldNode === "string" || typeof newNode === "string") {
		if (oldNode !== newNode) {
			parent.replaceChild(render(newNode), el);
		}
		return;
	}
	if (!(el instanceof HTMLElement)) throw new Error("unexpected node");
	const newTag = newNode.tag.toLowerCase();
	if (
		oldNode.tag.toLowerCase() !== newTag ||
		el.tagName.toLowerCase() !== newTag
	) {
		el.replaceWith(render(newNode));
		return;
	}
	for (const [key, value] of Object.entries(newNode.props)) {
		if (key.startsWith("on")) {
			const eventName = key.slice(2).toLowerCase();
			// @ts-ignore
			el.removeEventListener(eventName, oldNode.props[key]);
			// @ts-ignore
			el.addEventListener(eventName, value);
		} else if (oldNode.props[key] !== value) {
			el.setAttribute(key, String(value));
		}
	}
	const oldChildren = oldNode.children;
	const newChildren = newNode.children;
	const length = Math.min(oldChildren.length, newChildren.length);
	for (let i = 0; i < length; i++) {
		patch(el, oldChildren[i], newChildren[i], i);
	}
}

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
