/** @param {NS} ns **/
function getAvailableExploits(ns)
{
	return [
		"BruteSSH.exe",
		"FTPCrack.exe",
		"relaySMTP.exe",
		"HTTPWorm.exe",
		"SQLInject.exe",
	].filter(x => ns.fileExists(x)).length;
}

/** @param {NS} ns */
function shouldSendWalker(ns)
{
	const maxPorts = getAvailableExploits(ns);
	const visited = ['home'];
	const myLevel = ns.getHackingLevel();
	let servers = ns.scan('home');
	
	while (servers.length > 0)
	{
		let server = servers.pop();

		if (visited.includes(server))
		{
			continue;
		}

		servers = servers.concat(ns.scan(server));
		visited.push(server);
	}

	for (const server of visited)
	{
		const walkerRam = ns.getScriptRam("walker.js");
		const serverRam = ns.getServerUsedRam(server);
		const serverMaxRam = ns.getServerMaxRam(server);
		const serverPorts = ns.getServerNumPortsRequired(server);
		const serverLevel = ns.getServerRequiredHackingLevel(server);
		const hasRoot = ns.hasRootAccess(server);

		if (!hasRoot && maxPorts >= serverPorts && myLevel >= serverLevel && (serverMaxRam - serverRam) >= walkerRam)
		{
			return true;
		}
	}

	return false;
}

/** @param {NS} ns **/
export async function main(ns) {
	while (true)
	{
		if (shouldSendWalker(ns))
		{
			ns.tprintf("Re-sending walker.");

			ns.run("kill_zombies.js");
			await ns.sleep(1000);
			ns.run("walker.js");
		}
		
		await ns.sleep(60 * 1000);
	}
}