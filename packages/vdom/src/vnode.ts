export type VNode = {
	tag: string;
	props: Record<string, unknown>;
	children: (string | VNode)[];
};
