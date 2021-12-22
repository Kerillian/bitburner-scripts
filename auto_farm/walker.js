/** @param {NS} ns **/
function getAvailableExploits(ns)
{
	const all = [
		{Name: "BruteSSH.exe", Func: ns.brutessh},
		{Name: "FTPCrack.exe", Func: ns.ftpcrack},
		{Name: "relaySMTP.exe", Func: ns.relaysmtp},
		{Name: "HTTPWorm.exe", Func: ns.httpworm},
		{Name: "SQLInject.exe", Func: ns.sqlinject}
	];

	const available = [];

	for (let exploit of all)
	{
		if (ns.fileExists(exploit.Name, "home"))
		{
			available.push(exploit);
		}
	}

	return available;
}

/**
 * @param {NS} ns
 * @param {Number} maxPorts
 **/
function getHackableServers(ns, maxPorts)
{
	const servers = ns.scan();
	const myHL = ns.getHackingLevel();
	const scriptRam = ns.getScriptRam(ns.getScriptName())
	const valid = [];

	for (let server of servers)
	{
		const serverHL = ns.getServerRequiredHackingLevel(server);
		const serverPorts = ns.getServerNumPortsRequired(server);
		const serverRamMax = ns.getServerMaxRam(server);
		const serverRamUsed = ns.getServerUsedRam(server);
		const serverRoot = ns.hasRootAccess(server);

		if (scriptRam > serverRamMax - serverRamUsed)
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

		valid.push({Name: server, Ports: serverPorts, Root: serverRoot, MaxRam: serverRamMax, RamUsed: serverRamUsed});
	}

	return valid;
}

/** @param {NS} ns **/
async function spread(ns, server)
{
	await ns.scp([ns.getScriptName(), "zombie.js"], server);
	ns.exec(ns.getScriptName(), server);
}

/** @param {NS} ns **/
export async function main(ns) {
	const exploits = getAvailableExploits(ns);
	const servers = getHackableServers(ns, exploits.length);
	const me = ns.getHostname();

	for (let server of servers)
	{
		if (server.Name == "home")
		{
			continue;
		}

		if (server.Root === true)
		{
			await spread(ns, server.Name);
			continue;
		}

		if (server.Ports > 0)
		{
			for (let i = 0; i < server.Ports; i++)
			{
				exploits[i].Func(server.Name);
			}
		}

		ns.nuke(server.Name);
		await spread(ns, server.Name);
	}

	if (me != "home")
	{
		const threads = Math.floor((ns.getServerMaxRam(me) - ns.getServerUsedRam(me)) / ns.getScriptRam("zombie.js"));

		if (threads > 0)
		{
			ns.run("zombie.js", threads);
		}
	}
}