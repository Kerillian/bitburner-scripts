/** @param {NS} ns **/
export function main(ns)
{
	ns.tprintf("ERROR: klib can't be ran like software. klib is a utility library written by Kerillian for her scripts.");
}

/**
 * Methods
 */

/** @param {NS} ns **/
export function getExploits(ns)
{
	return [
		{Name: "BruteSSH.exe", Run: ns.brutessh},
		{Name: "FTPCrack.exe", Run: ns.ftpcrack},
		{Name: "relaySMTP.exe", Run: ns.relaysmtp},
		{Name: "HTTPWorm.exe", Run: ns.httpworm},
		{Name: "SQLInject.exe", Run: ns.sqlinject}
	].filter(x => ns.fileExists(x.Name, "home"));
}

/** @param {NS} ns **/
export function getExploitCount(ns)
{
	return [
		"BruteSSH.exe",
		"FTPCrack.exe",
		"relaySMTP.exe",
		"HTTPWorm.exe",
		"SQLInject.exe"
	].filter(x => ns.fileExists(x, "home")).length;
}

/**
 * @param {NS} ns
 * @returns {String[]}
 */
export function getHostnames(ns)
{
	const servers = [];
	let results = ns.scan("home");

	while (results.length > 0)
	{
		const server = results.pop();

		if (!servers.includes(server))
		{
			results = results.concat(ns.scan(server));
			servers.push(server);
		}
	}

	return servers;
}

/**
 * @param {NS} ns
 * @returns {Server[]}
 */
export function getServers(ns)
{
	return getHostnames().map(x => ns.getServer(x));
}

/**
 * @summary Get the document object without the ram cost.
 * @returns {Document}
 */
export function getDocument()
{
	return eval("document");
}