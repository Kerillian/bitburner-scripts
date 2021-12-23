/*
	A Utility script to help manage player-owned servers.

	run svman.js list
	run svman.js prices
	run svman.js buy [gigs=512] [name="xpfram"]
	run svman.js delete [name]
*/

/** @param {NS} ns **/
export async function main(ns)
{
	const subs = {
		"list": listServers,
		"prices": listPrices,
		"buy": buyServer,
		"delete": rmServer
	};

    const func = subs[ns.args[0] || "list"];

	if (func)
	{
		const isAsync = func.constructor.name == "AsyncFunction";
		isAsync ? await func(ns, ns.args) : func(ns, ns.args);
	}
	else
	{
		ns.tprintf("Invalid sub command, possible commands are:");

		for (const name in subs)
		{
			ns.tprintf(`  --> ${name}`);
		}
	}
}

/**
 * @param {NS} ns
 * @param {String[]} args
 * @param {Boolean?} h
 **/
function listServers(ns, args)
{
	const servers = ns.getPurchasedServers();

	for (let name of servers)
	{
		const usedRam = ns.getServerUsedRam(name);
		const maxRam = ns.getServerMaxRam(name);
		const percentage = (100 * usedRam) / maxRam;
		const data = ns.getServer(name);

		ns.tprintf(`Name: ${name} (${data.ip})`);
		ns.tprintf(`  --> Ram: ${maxRam}gb`);
		ns.tprintf(`  --> Used: ${usedRam}gb (%${percentage.toFixed(2)})`);
	}
}

/**
 * @param {NS} ns
 * @param {String[]} args
 * @param {Boolean?} h
 **/
function listPrices(ns, args)
{
	for (let i = 0; i < 20; i++)
	{
		const gb = Math.pow(2, i + 1);
		const price = ns.getPurchasedServerCost(gb);

		ns.tprintf(`${ns.nFormat(gb * 1073741824, "0b").padEnd(5)} -> ${ns.nFormat(price, "$0.00a")}`);
	}
}

/**
 * @param {NS} ns
 * @param {String[]} args
 * @param {Boolean?} h
 **/
async function buyServer(ns, args)
{
	let gigs = args[1] || 512;
	const name = args[2] || "xpfarm";

	if (Math.log2(gigs) % 1 !== 0)
	{
		gigs = 1 << 32 - Math.clz32(gigs);
	}

	const cost = ns.getPurchasedServerCost(gigs);
	const okay = await ns.prompt(`A server with ${gigs} gigs will cost ${ns.nFormat(cost, "$0.000a")}, purchase?`);

	if (okay)
	{
		const host = ns.purchaseServer(name, gigs);
		ns.tprintf(`Purchased server: ${host}`);
	}
}

/**
 * @param {NS} ns
 * @param {String[]} args
 * @param {Boolean?} h
 **/
async function rmServer(ns, args)
{
	const name = args[1];

	if (!name)
	{
		ns.tprintf("Usage: svman.js delete [name]");
	}

	if (!ns.serverExists(name))
	{
		ns.tprintf(name + " doesn't exist");
	}

	const okay = await ns.prompt(`Are you sure you want to delete "${name}"?`);

	if (okay)
	{
		ns.tprintf(ns.deleteServer(name) ? `Deleted "${name}".` : `Something went wrong when trying to delete "${name}".`);
	}
}