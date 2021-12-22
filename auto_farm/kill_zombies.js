/** @param {NS} ns **/
export async function main(ns) {
    const servers = ns.scan();
	const script = ns.getScriptName();
	const me = ns.getHostname();

	for (let server of servers)
	{
		if (server == "home")
		{
			continue;
		}

		if (ns.hasRootAccess(server))
		{
			if (ns.scriptRunning("zombie.js", server))
			{
				ns.kill("zombie.js");
				await ns.scp(script, me, server);
				ns.exec(script, server);
			}
			else if (ns.fileExists(script, server))
			{
				ns.rm(script, server);
			}
		}
	}
}