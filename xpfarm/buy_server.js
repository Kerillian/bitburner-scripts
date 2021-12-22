/** @param {NS} ns **/
export async function main(ns) {
	const name = ns.args[0] || "temp";
	let gigs   = ns.args[1] || 64;

	// If the number isn't a power of 2
	if (Math.log2(gigs) % 1 !== 0)
	{
		// Then find the nearest power of 2
		gigs = 1 << 32 - Math.clz32(gigs);
	}

	const cost = ns.getPurchasedServerCost(gigs);
	const okay = await ns.prompt(`A server with ${gigs} gigs will cost ${ns.nFormat(cost, "$0.000a")}, purchase?`);

	if (okay)
	{
		const host = ns.purchaseServer(name, gigs);
		ns.connect(host);
	}
}