import { h } from "./h";

const target = document.getElementById("app");
if (target) {
	target.innerHTML = h("h1", { class: "title" }, [
		"Hello, ",
		h("i", {}, ["world"]),
	]);
}
