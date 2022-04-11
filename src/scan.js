import {getExploitCount, getHostnames} from "klib.js";

/*
    Helps locate servers that have zombies running, have root access, or available to hack into.
*/

/** @param {NS} ns */
export async function main(ns) {
    
    const maxPorts = getExploitCount(ns);
    const visited = getHostnames(ns);
    
    const rooted = [];
	const zombies = [];
	const hackable = [];
    
    for (let i = 0; i < visited.length; i++)
	{
        const server = visited[i];
		const serverPorts = ns.getServerNumPortsRequired(server);
		const serverLevel = ns.getServerRequiredHackingLevel(server);
		const hasRoot = ns.hasRootAccess(server);
		const hasZombie = ns.scriptRunning("zombie.js", server);

        if (maxPorts >= serverPorts && ns.getHackingLevel() >= serverLevel)
		{
			if (hasRoot && !hasZombie)
            {
                rooted.push(server);
                continue;
            }

            if (hasZombie)
            {
                zombies.push(server);
                continue;
            }

            hackable.push(server);
        }
    }

    ns.tprintf("Zombies");
    ns.tprintf(zombies.map(x => `  --> ${x}`).join("\n") + "\n");

    ns.tprintf("Rooted");
    ns.tprintf(rooted.map(x => `  --> ${x}`).join("\n") + "\n");

    ns.tprintf("Hackable");
    ns.tprintf(hackable.map(x => `  --> ${x}`).join("\n") + "\n");
}