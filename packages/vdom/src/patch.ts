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
	parent: Node,
	oldChildren: (string | VNode)[],
	newChildren: (string | VNode)[],
) {
	const length = Math.max(oldChildren.length, newChildren.length);
	for (let i = 0; i < length; i++) {
		patch(parent, oldChildren[i], newChildren[i], i);
	}
}

export function patch(
	parent: Node,
	oldNode: VNode | string | undefined,
	newNode: VNode | string | undefined,
	index = 0,
) {
	if (newNode === undefined) {
		parent.removeChild(parent.childNodes[index]);
		return;
	}
	if (typeof newNode === "string") {
		patchStringNode(parent, oldNode, newNode, index);
		return;
	}
	patchElementNode(parent, oldNode, newNode, index);
}

function patchStringNode(
	parent: Node,
	oldNode: VNode | string | undefined,
	newNode: string,
	index: number,
) {
	if (oldNode === newNode) return;
	if (oldNode === undefined) {
		parent.appendChild(document.createTextNode(newNode));
		return;
	}
	parent.replaceChild(
		document.createTextNode(newNode),
		parent.childNodes[index],
	);
}

function patchElementNode(
	parent: Node,
	oldNode: VNode | string | undefined,
	newNode: VNode,
	index: number,
) {
	if (oldNode === undefined) {
		const el = document.createElement(newNode.tag);
		patchAttrs(el, {}, newNode.props);
		patchChildren(el, [], newNode.children);
		parent.appendChild(el);
		return;
	}
	const el = parent.childNodes[index];
	if (typeof oldNode === "string") {
		parent.replaceChild(document.createElement(newNode.tag), el);
		return;
	}
	if (oldNode.tag !== newNode.tag) {
		const newEl = document.createElement(newNode.tag);
		patchAttrs(newEl, {}, newNode.props);
		patchChildren(newEl, [], newNode.children);
		parent.replaceChild(newEl, el);
		return;
	}
	patchAttrs(el as HTMLElement, oldNode.props, newNode.props);
	patchChildren(el, oldNode.children, newNode.children);
}
