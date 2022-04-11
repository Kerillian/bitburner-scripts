/*
	Automated contract solver
	
	All the solver methods are just slightly modifed functions from the games internal source code.
	https://github.com/danielyxie/bitburner/blob/master/src/data/codingcontracttypes.ts
*/

import {getHostnames} from "klib.js";

const ContractSolvers =
{
	"Find Largest Prime Factor": function(data)
	{
		let fac = 2;
		let n = data;

		while (n > (fac - 1) * (fac - 1))
		{
			while (n % fac === 0)
			{
				n = Math.round(n / fac);
			}

			++fac;
		}

		return (n === 1 ? fac - 1 : n).toString();
	},

	"Subarray with Maximum Sum": function(data)
	{
		const nums = data.slice();

		for (let i = 1; i < nums.length; i++)
		{
			nums[i] = Math.max(nums[i], nums[i] + nums[i - 1]);
		}

		return Math.max(...nums).toString();
	},

	"Total Ways to Sum": function(data)
	{
		const ways = [1];
		ways.length = data + 1;
		ways.fill(0, 1);

		for (let i = 1; i < data; ++i)
		{
			for (let j = i; j <= data; ++j)
			{
				ways[j] += ways[j - i];
			}
		}

		return ways[data].toString();
	},

	"Spiralize Matrix": function(data)
	{
		const spiral = [];
		const m = data.length;
		const n = data[0].length;
		let u = 0;
		let d = m - 1;
		let l = 0;
		let r = n - 1;
		let k = 0;

		while (true)
		{
			// Up
			for (let col = l; col <= r; col++)
			{
				spiral[k] = data[u][col];
				++k;
			}

			if (++u > d)
			{
				break;
			}

			// Right
			for (let row = u; row <= d; row++)
			{
				spiral[k] = data[row][r];
				++k;
			}

			if (--r < l)
			{
				break;
			}

			// Down
			for (let col; col >= l; col--)
			{
				spiral[k] = data[d][col];
				++k;
			}

			if (--d < u)
			{
				break;
			}

			// Left
			for (let row = d; row >= u; row--)
			{
				spiral[k] = data[row][l];
				++k;
			}

			if (++l > r)
			{
				break;
			}
		}

		//TODO: NEEDS TO BE CHECKED
		return ",".join(spiral);
	},

	"Array Jumping Game": function(data)
	{
		const n = data.length;
		let i = 0;

		for (let reach = 0; i < n && i <= reach; ++i)
		{
			reach = Math.max(i + data[i], reach);
		}

		return i === n ? "1" : "0";
	},

	"Merge Overlapping Intervals": function(data)
	{
		const intervals = data.slice();

		intervals.sort((a, b) => a[0] - b[0]);

		const result = [];
		let start = intervals[0][0];
		let end = intervals[0][1];
		
		for (const interval of intervals)
		{
			if (interval[0] <= end)
			{
				end = Math.max(end, interval[1]);
			}
			else
			{
				result.push([start, end]);
				start = interval[0];
				end = interval[1];
			}
		}

		result.push([start, end]);

		return convert2DArrayToString(result);
	},

	"Generate IP Addresses": function(data)
	{
		const ret = [];

		for (let a = 1; a <= 3; ++a)
		{
			for (let b = 1; b <= 3; ++b)
			{
				for (let c = 1; c <= 3; ++c)
				{
					for (let d = 1; d <= 3; ++d)
					{
						if (a + b + c + d === data.length)
						{
							const A = parseInt(data.substring(0, a), 10);
							const B = parseInt(data.substring(a, a + b), 10);
							const C = parseInt(data.substring(a + b, a + b + c), 10);
							const D = parseInt(data.substring(a + b + c, a + b + c + d), 10);

							if (A <= 255 && B <= 255 && C <= 255 && D <= 255)
							{
								const ip = [A.toString(), ".", B.toString(), ".", C.toString(), ".", D.toString()].join("");

								if (ip.length === data.length + 3)
								{
									ret.push(ip);
								}
							}
						}
					}
				}
			}
		}

		return `[${",".join(ret)}]`;
	},

	"Algorithmic Stock Trader I": function(data)
	{
		let maxCur = 0;
		let maxSoFar = 0;

		for (let i = 1; i < data.length; ++i)
		{
			maxCur = Math.max(0, (maxCur += data[i] - data[i - 1]));
			maxSoFar = Math.max(maxCur, maxSoFar);
		}

		return maxSoFar.toString();
	},

	"Algorithmic Stock Trader II": function(data)
	{
		let profit = 0;

		for (let p = 1; p < data.length; ++p)
		{
			profit += Math.max(data[p] - data[p - 1], 0);
		}

		return profit.toString();
	},

	"Algorithmic Stock Trader III": function(data)
	{
		let hold1 = Number.MIN_SAFE_INTEGER;
		let hold2 = Number.MIN_SAFE_INTEGER;
		let release1 = 0;
		let release2 = 0;

		for (const price of data)
		{
			release2 = Math.max(release2, hold2 + price);
			hold2 = Math.max(hold2, release1 - price);
			release1 = Math.max(release1, hold1 + price);
			hold1 = Math.max(hold1, price * -1);
		}

		return release2.toString();
	},

	"Algorithmic Stock Trader IV": function(data)
	{
		const k = data[0];
		const prices = data[1];

		const len = prices.length;

		if (len < 2)
		{
			return "0";
		}

		if (k > len / 2)
		{
			let res = 0;

			for (let i = 1; i < len; ++i)
			{
				res += Math.max(prices[i] - prices[i - 1], 0);
			}

			return res.toString();
		}

		const hold = [];
		const rele = [];
		hold.length = k + 1;
		rele.length = k + 1;

		for (let i = 0; i <= k; ++i)
		{
			hold[i] = Number.MIN_SAFE_INTEGER;
			rele[i] = 0;
		}

		let cur;

		for (let i = 0; i < len; ++i)
		{
			cur = prices[i];

			for (let j = k; j > 0; --j)
			{
				rele[j] = Math.max(rele[j], hold[j] + cur);
				hold[j] = Math.max(hold[j], rele[j - 1] - cur);
			}
		}

		return rele[k].toString();
	},

	"Minimum Path Sum in a Triangle": function(data)
	{
		const n = data.length;
		const dp = data[n - 1].slice();

		for (let i = n - 2; i > -1; --i)
		{
			for (let j = 0; j < data[i].length; ++j)
			{
				dp[j] = Math.min(dp[j], dp[j + 1]) + data[i][j];
			}
		}

		return dp[0].toString();
	},

	"Unique Paths in a Grid I": function(data)
	{
		const n = data[0]; // Number of rows
		const m = data[1]; // Number of columns
		const currentRow = [];
		currentRow.length = n;

		for (let i = 0; i < n; i++)
		{
			currentRow[i] = 1;
		}

		for (let row = 1; row < m; row++)
		{
			for (let i = 1; i < n; i++)
			{
				currentRow[i] += currentRow[i - 1];
			}
		}

		return currentRow[n - 1].toString();
	},

	"Unique Paths in a Grid II": function(data)
	{
		const obstacleGrid = [];
		obstacleGrid.length = data.length;

		for (let i = 0; i < obstacleGrid.length; ++i)
		{
			obstacleGrid[i] = data[i].slice();
		}

		for (let i = 0; i < obstacleGrid.length; i++)
		{
			for (let j = 0; j < obstacleGrid[0].length; j++)
			{
				if (obstacleGrid[i][j] == 1)
				{
					obstacleGrid[i][j] = 0;
				}
				else if (i == 0 && j == 0)
				{
					obstacleGrid[0][0] = 1;
				}
				else
				{
					obstacleGrid[i][j] = (i > 0 ? obstacleGrid[i - 1][j] : 0) + (j > 0 ? obstacleGrid[i][j - 1] : 0);
				}
			}
		}

		return obstacleGrid[obstacleGrid.length - 1][obstacleGrid[0].length - 1].toString();
	},

	"Sanitize Parentheses in Expression": function(data)
	{
		let left = 0;
		let right = 0;
		const res = [];

		for (let i = 0; i < data.length; ++i)
		{
			if (data[i] === "(")
			{
				++left;
			}
			else if (data[i] === ")")
			{
				left > 0 ? --left : ++right;
			}
		}

		function dfs(pair, index, left, right, s, solution, res)
		{
			if (s.length === index)
			{
				if (left === 0 && right === 0 && pair === 0)
				{
					for (let i = 0; i < res.length; i++)
					{
						if (res[i] === solution)
						{
							return;
						}
					}

					res.push(solution);
				}

				return;
			}
	
			if (s[index] === "(")
			{
				if (left > 0)
				{
					dfs(pair, index + 1, left - 1, right, s, solution, res);
				}

				dfs(pair + 1, index + 1, left, right, s, solution + s[index], res);
			}
			else if (s[index] === ")")
			{
				if (right > 0) dfs(pair, index + 1, left, right - 1, s, solution, res);
				if (pair > 0) dfs(pair - 1, index + 1, left, right, s, solution + s[index], res);
			}
			else
			{
				dfs(pair, index + 1, left, right, s, solution + s[index], res);
			}
		}

		dfs(0, 0, left, right, data, "", res);

		return `[${",".join(res)}]`;
	},

	"Find All Valid Math Expressions": function(data)
	{
		const num = data[0];
		const target = data[1];

		function helper(res,path,num,target,pos,evaluated,multed)
		{
			if (pos === num.length) 
			{
				if (target === evaluated)
				{
					res.push(path);
				}

				return;
			}

			for (let i = pos; i < num.length; ++i)
			{
				if (i != pos && num[pos] == "0")
				{
					break;
				}

				const cur = parseInt(num.substring(pos, i + 1));

				if (pos === 0)
				{
					helper(res, path + cur, num, target, i + 1, cur, cur);
				}
				else
				{
					helper(res, path + "+" + cur, num, target, i + 1, evaluated + cur, cur);
					helper(res, path + "-" + cur, num, target, i + 1, evaluated - cur, -cur);
					helper(res, path + "*" + cur, num, target, i + 1, evaluated - multed + multed * cur, multed * cur);
				}
			}
		}

		if (num == null || num.length === 0)
		{
			return "[]";
		}

		const result = [];
		helper(result, "", num, target, 0, 0, 0);

		return `[${",".join(result)}]`;
	}
}

function convert2DArrayToString(arr)
{
	const components = [];
	
	arr.forEach((e) =>
	{
		let s = e.toString();
		s = ["[", s, "]"].join("");
		components.push(s);
	});
  
	return components.join(",").replace(/\s/g, "");
}

/** @param {NS} ns **/
export async function main(ns)
{
	const cc = ns.codingcontract;
	const hosts = getHostnames(ns);

	for (const name of hosts)
	{
		const contracts = ns.ls(name, ".cct");

		for (const contract of contracts)
		{
			const type = cc.getContractType(contract, name);
			const data = cc.getData(contract, name);
			const solver = ContractSolvers[type];

			if (solver)
			{
				const solved = solver(data);
				ns.tprintf(cc.attempt(solved, contract, name) ? `Solved: ${contract} [${name}]` : `ERROR: ${contract} [${name}]`);
			}
		}
	}
}