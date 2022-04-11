/** @param {NS} ns **/
export async function main(ns)
{
	let target = ns.args[0] || "n00dles";

	if (!ns.serverExists(target))
	{
		ns.tprint("ERROR: Cannot resolve hostname: " + target);
		return;
	}
	
	const path = traverse(ns, ns.getHostname(), target);

	ns.tprintf("Starting at origin: " + ns.getHostname());
	ns.tprintf(`Path : ${path.join(" -> ")}`);
	ns.tprintf(`Cmds : ${path.map(x => `connect ${x}`).join("; ")}`);

	return;
}

/** @param {NS} ns **/
function traverse(ns, origin, target, cur_path=[])
{
	const path = cur_path.slice();
	path.push(origin);

	if (origin == target)
	{
		return path;
	}
	
	const nodes = ns.scan(origin);

	if (nodes.length === 0)
	{
		ns.print("failing because there is no possible path.");
		return -1;
	}
	
	while (nodes.length !== 0)
	{
		const node = nodes.pop();

		if (path.includes(node))
		{
			continue;
		}
		else
		{
			let new_path = traverse(ns, node, target, path);

			if (new_path != -1)
			{
				return new_path;
			}
		}
	}

	ns.print("failing because current tree failed.");
	return -1;
}

export function autocomplete(data, args)
{
	return [...data.servers];
}