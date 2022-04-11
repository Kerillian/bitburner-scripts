/**
 * This is just a modified script by Nolshine
 * https://github.com/Nolshine/bitburner-scripts/blob/master/daemon.ns.js
 */

/** @param {NS} ns **/
export async function main(ns)
{
	const host = ns.getHostname();
	const threads = ns.args[0];

	await doWeaken(ns, host, threads);

	while (true)
	{
		await doGrow(ns, host, threads);
		await doHack(ns, host, threads);
	}
}

/** @param {NS} ns **/
async function doWeaken(ns, host, threads)
{
	const min = ns.getServerMinSecurityLevel(host);
	
	while (ns.getServerSecurityLevel(host) > min)
	{
		const diff = ns.getServerSecurityLevel(host) - min;
		const toUse = Math.min(Math.ceil(diff / 0.05), threads);

		await ns.weaken(host, { threads: toUse });
	}
}

/** @param {NS} ns **/
async function doGrow(ns, host, threads)
{
	const max = ns.getServerMaxMoney(host);

	while (ns.getServerMoneyAvailable(host) < max)
	{
		let weakenActual = threads < 13 ? 1 : Math.floor(threads / 13);
		let growActual = threads < 13 ? threads - 1 : weakenActual * 12;

		if (ns.getServerMoneyAvailable(host) > 0)
		{
			const factor = max / ns.getServerMoneyAvailable(host);
			const growNeeded = Math.ceil(ns.growthAnalyze(host, factor));
			const weakenNeeded = Math.ceil(growNeeded / 12);

			if (growNeeded + weakenNeeded <= threads)
			{
				weakenActual = weakenNeeded;
				growActual = growNeeded;
			}
		}

		await ns.grow(host, { threads: growActual });
		await ns.weaken(host, { threads: weakenActual });
	}
}

/** @param {NS} ns **/
async function doHack(ns, host, threads)
{
	let tHack = threads < 26 ? threads - 1 : Math.floor(threads / 26) * 25;
	let tWeaken = Math.max(1, threads < 26 ? 1 : Math.floor(threads / 26));

	let moneyToHack = ns.getServerMaxMoney(host) * 0.1;
	let hackNeeded = Math.ceil(ns.hackAnalyzeThreads(host, moneyToHack));
	let hackActual = Math.min(hackNeeded, tHack);
	let weakenNeeded = Math.ceil(hackActual / 25);
	let weakenActual = Math.min(weakenNeeded, tWeaken);

	await ns.hack(host, { threads: hackActual });
	await ns.weaken(host, { threads: weakenActual });
}