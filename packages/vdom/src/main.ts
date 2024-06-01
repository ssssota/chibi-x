import { createApp } from "./app";
import { h } from "./h";

const target = document.getElementById("app");
if (target) {
	let count = 0;
	const app = createApp(() =>
		h("h1", { class: "title" }, [
			"Hello, ",
			h("i", { onClick: () => alert("world") }, ["world"]),
			h(
				"button",
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
