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
		const builder = new MessageBuilder();
		builder.addLine("Invalid sub command, possible commands are:");

		for (const name in subs)
		{
			const isAsync = subs[name].constructor.name == "AsyncFunction";
			builder.addLine(`  --> ${name} ${isAsync ? await subs[name](null, null, true) : subs[name](null, null, true)}`);
		}

		ns.tprint(builder.build());
	}
}

class MessageBuilder
{
	constructor()
	{
		this.lines = ["\n"];
	}

	add(str)
	{
		this.lines.push(this.lines.pop() + str);
	}

	addLine(str)
	{
		this.lines.push(str);
	}

	build()
	{
		return this.lines.join("\n") + "\n\n";
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
	const builder = new MessageBuilder();

	for (let name of servers)
	{
		const usedRam = ns.getServerUsedRam(name);
		const maxRam = ns.getServerMaxRam(name);
		const percentage = (100 * usedRam) / maxRam;
		const data = ns.getServer(name);

		builder.addLine(`Name: ${name} (${data.ip})`);
		builder.addLine(`  --> Ram: ${maxRam}gb`);
		builder.addLine(`  --> Used: ${usedRam}gb (%${percentage.toFixed(2)})`);
	}

	ns.tprint(builder.build());
}

/**
 * @param {NS} ns
 * @param {String[]} args
 * @param {Boolean?} h
 **/
function listPrices(ns, args)
{
	const builder = new MessageBuilder();

	for (let i = 0; i < 20; i++)
	{
		const gb = Math.pow(2, i + 1);
		const price = ns.getPurchasedServerCost(gb);

		builder.addLine(`${ns.nFormat(gb * 1073741824, "0b").padEnd(5)} -> ${ns.nFormat(price, "$0.00a")}`);
	}

	ns.tprint(builder.build());
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
		ns.tprint(`Purchased server: ${host}`);
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
		ns.tprint("Usage: svman.js delete [name]");
	}

	if (!ns.serverExists(name))
	{
		ns.tprint(name + " doesn't exist");
	}

	const okay = await ns.prompt(`Are you sure you want to delete "${name}"?`);

	if (okay)
	{
		ns.tprint(ns.deleteServer(name) ? `Deleted "${name}".` : `Something went wrong when trying to delete "${name}".`);
	}
}