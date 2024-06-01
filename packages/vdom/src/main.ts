import { createApp } from "./app";
import type { Component } from "./component";
import { h } from "./h";

const Button = ((props, children) => {
	return h("button", props, children);
}) satisfies Component<{ onClick: () => void }>;

const target = document.getElementById("app");
if (target) {
	let count = 0;
	const app = createApp(() =>
		h("h1", { class: "title" }, [
			"Hello, ",
			h("i", { onClick: () => alert("world") }, ["world"]),
			h(
				Button,
				{
					onClick: () => {
						count++;
						app.rerender({});
					},
				},
				[count.toString()],
			),
		]),
	);
	app.mount(target, {});
}
