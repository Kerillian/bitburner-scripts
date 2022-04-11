/** @param {NS} ns **/
export async function main(ns) {
	const host = ns.args[0];
	const script = ns.args[1];
	const script_args = ns.args.slice(2);

	if (!ns.serverExists(host))
	{
		ns.tprint(`Server '${host}' does not exist. Aborting.`);
		return;
	}

	if (!ns.hasRootAccess(host))
	{
		ns.tprint(`You don't have root for '${host}'. Aborting.`);
		return;
	}

	if (!ns.ls(ns.getHostname()).find(f => f === script))
	{
		ns.tprint(`Script '${script}' does not exist. Aborting.`);
		return;
	}

	const threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(script));

	if (0 > threads)
	{
		ns.tprint("Can't launch that script on that server, it needs more RAM.");
		return;
	}

	ns.tprint(`Launching script '${script}' on server '${host}' with ${threads} threads and the following arguments: ${script_args}`);
	await ns.scp(script, ns.getHostname(), host);
	ns.exec(script, host, threads, ...script_args);
}

export function autocomplete(data, args)
{
	return [...data.servers, ...data.scripts];
}