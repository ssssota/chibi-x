import { createApp } from "./app";
import type { Component } from "./component";
import { h } from "./h";

const Button = ((props, children) => {
	return h("button", props, children);
}) satisfies Component<{ onClick: () => void }>;

const target = document.getElementById("app");
if (target) {
	let count = 0;
	const app = createApp(() => (
		<h1 class="title">
			Hello,
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: This is a test */}
			<i onClick={() => alert("world")}>world</i>
			<Button
				onClick={() => {
					count++;
					app.rerender({});
				}}
			>
				{count.toString()}
			</Button>
		</h1>
	));
	app.mount(target, {});
}
