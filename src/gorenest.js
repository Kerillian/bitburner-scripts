import {getHostnames, getExploits} from "klib.js";

/*
* Config stuff
*/
const config = {
	Worker: "marauder.js",
	Wait: 10
}

/** @param {NS} ns **/
export async function main(ns)
{
	let exploits = getExploits(ns);
	let servers = getTargets(ns, exploits.length);

	for (const server of servers)
	{
		ns.killall(server.Name);
	}

	while (true)
	{
		exploits = getExploits(ns);
		servers = getTargets(ns, exploits.length);

		for (const server of servers)
		{
			if (server.Working)
			{
				continue;
			}

			if (!server.Root)
			{
				exploits.forEach(x => x.Run(server.Name));
				ns.nuke(server.Name);
			}

			await infect(ns, server.Name);
		}

		await ns.sleep(config.Wait * 1000);
	}
}

/** @param {NS} ns **/
async function infect(ns, server)
{
	const threads = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam(config.Worker));

	if (threads > 0 && await ns.scp(config.Worker, "home", server))
	{
		ns.exec(config.Worker, server, threads, threads);
	}
	else
	{
		ns.tprintf(`ERROR: Failed to infect: ${server}`);
	}
}

/**
 * @param {NS} ns
 * @param {Number} maxPorts
 **/
function getTargets(ns, maxPorts)
{
	const servers = getHostnames(ns);
	const owned = ns.getPurchasedServers();
	const myHL = ns.getHackingLevel();
	const scriptRam = ns.getScriptRam(config.Worker);
	const valid = [];

	for (const server of servers)
	{
		if (server == "home" || owned.includes(server))
		{
			continue;
		}

		const serverHL = ns.getServerRequiredHackingLevel(server);
		const serverPorts = ns.getServerNumPortsRequired(server);
		const serverRamMax = ns.getServerMaxRam(server);
		const serverRoot = ns.hasRootAccess(server);
		const hasWorker = ns.scriptRunning(config.Worker, server);

		if (scriptRam > serverRamMax)
		{
			continue;
		}

		if (serverHL > myHL)
		{
			continue;
		}

		if (serverPorts > maxPorts)
		{
			continue;
		}

		valid.push({
			Name: server,
			Ports: serverPorts,
			Root: serverRoot,
			Working: hasWorker
		});
	}

	return valid;
}