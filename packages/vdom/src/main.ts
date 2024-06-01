import { createApp } from "./app";
import { h } from "./h";

const target = document.getElementById("app");
if (target) {
	const app = createApp(
		h("h1", { class: "title" }, [
			"Hello, ",
			h("i", { onClick: () => alert("world") }, ["world"]),
		]),
	);
	app.mount(target);
}
