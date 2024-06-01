export function h(
	tag: string,
	props: Record<string, unknown>,
	children: string[],
): string {
	return `<${tag} ${Object.entries(props)
		.map(([key, value]) => `${key}=${JSON.stringify(String(value))}`)
		.join(" ")}>${children.join("")}</${tag}>`;
}
