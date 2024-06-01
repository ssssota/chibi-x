import type { Component } from "./component";
import type { VNode } from "./vnode";

function patchAttrs(
	el: HTMLElement,
	oldAttrs: Record<string, unknown>,
	newAttrs: Record<string, unknown>,
) {
	const oldKeys = Object.keys(oldAttrs);
	const oldEventHandlers = oldKeys.filter((key) => key.startsWith("on"));
	for (const key of oldEventHandlers) {
		const eventName = key.slice(2).toLowerCase();
		// @ts-ignore
		el.removeEventListener(eventName, oldAttrs[key]);
	}
	for (const [key, value] of Object.entries(newAttrs)) {
		if (key.startsWith("on")) {
			const eventName = key.slice(2).toLowerCase();
			// @ts-ignore
			el.addEventListener(eventName, value);
		} else if (oldAttrs[key] !== value) {
			el.setAttribute(key, String(value));
		}
	}
	for (const key of oldKeys) {
		if (!(key in newAttrs)) {
			el.removeAttribute(key);
		}
	}
}

function patchChildren(
	parent: HTMLElement,
	oldChildren: (string | VNode)[],
	newChildren: (string | VNode)[],
) {
	const length = Math.max(oldChildren.length, newChildren.length);
	for (let i = 0; i < length; i++) {
		patch(parent, oldChildren[i], newChildren[i], i);
	}
}

function patch(
	parent: Node,
	oldNode: VNode | string | undefined,
	newNode: VNode | string | undefined,
	index = 0,
) {
	if (newNode === undefined) {
		if (oldNode === undefined) return;
		parent.removeChild(parent.childNodes[index]);
		return;
	}
	if (oldNode === undefined) {
		if (typeof newNode === "string") {
			parent.appendChild(document.createTextNode(newNode));
			return;
		}
		const newEl = document.createElement(newNode.tag);
		patchAttrs(newEl, {}, newNode.props);
		patchChildren(newEl, [], newNode.children);
		parent.appendChild(newEl);
		return;
	}
	const el = parent.childNodes[index];
	if (typeof oldNode === "string") {
		if (typeof newNode === "string") {
			if (oldNode !== newNode) {
				el.replaceWith(document.createTextNode(newNode));
			}
			return;
		}
		parent.removeChild(el);
		patch(parent, undefined, newNode, index);
		return;
	}
	if (typeof newNode === "string") {
		el.replaceWith(document.createTextNode(newNode));
		return;
	}
	if (!(el instanceof HTMLElement)) throw new Error("unexpected node");
	const newTag = newNode.tag.toLowerCase();
	if (
		oldNode.tag.toLowerCase() !== newTag ||
		el.tagName.toLowerCase() !== newTag
	) {
		const newEl = document.createElement(newTag);
		patchAttrs(newEl, {}, newNode.props);
		patchChildren(newEl, [], newNode.children);
		return;
	}
	patchAttrs(el, oldNode.props, newNode.props);
	patchChildren(el, oldNode.children, newNode.children);
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
