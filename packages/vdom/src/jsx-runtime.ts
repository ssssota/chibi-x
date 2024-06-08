import { h } from "./h";
import type { VNode } from "./vnode";

export interface JSXSource {
	/**
	 * The source file where the element originates from.
	 */
	fileName?: string | undefined;

	/**
	 * The line number where the element was created.
	 */
	lineNumber?: number | undefined;

	/**
	 * The column number where the element was created.
	 */
	columnNumber?: number | undefined;
}

type HParameters = Parameters<typeof h>;

export function jsxDEV(
	type: HParameters[0],
	// biome-ignore lint/suspicious/noExplicitAny: all props are unknown
	{ children, ...props }: any,
	_key?: string,
	_isStatic?: boolean,
	_source?: JSXSource,
	_self?: unknown,
): VNode {
	return h(type, props, children);
}
export { jsxDEV as jsx, jsxDEV as jsxs, jsxDEV as jsxsDEV };
