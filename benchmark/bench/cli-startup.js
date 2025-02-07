import { fileURLToPath } from 'url';
import { execaCommand } from 'execa';
import { markdownTable } from 'markdown-table';
import { astroBin, calculateStat } from './_util.js';

/** Default project to run for this benchmark if not specified */
export const defaultProject = 'render-default';

/**
 * @param {URL} projectDir
 * @param {URL} outputFile
 */
export async function run(projectDir, outputFile) {
	const root = fileURLToPath(projectDir);

	console.log('Benchmarking `astro --help`...');
	const helpStat = await benchmarkCommand(`node ${astroBin} --help`, root);
	console.log('Done');

	console.log('Benchmarking `astro info`...');
	const infoStat = await benchmarkCommand(`node ${astroBin} info`, root);
	console.log('Done');

	console.log('Result preview:');
	console.log('='.repeat(10));
	console.log(`#### CLI Startup\n\n`);
	console.log(
		printResult({
			'astro --help': helpStat,
			'astro info': infoStat,
		})
	);
	console.log('='.repeat(10));
}

/**
 * @param {string} command
 * @param {string} root
 * @returns {Promise<import('./_util.js').Stat>}
 */
async function benchmarkCommand(command, root) {
	/** @type {number[]} */
	const durations = [];

	for (let i = 0; i < 10; i++) {
		const start = performance.now();
		await execaCommand(command, { cwd: root });
		durations.push(performance.now() - start);
	}

	// From the 10 durations, calculate average, standard deviation, and max value
	return calculateStat(durations);
}

/**
 * @param {Record<string, import('./_util.js').Stat>} result
 */
function printResult(result) {
	return markdownTable(
		[
			['Command', 'Avg (ms)', 'Stdev (ms)', 'Max (ms)'],
			...Object.entries(result).map(([command, { avg, stdev, max }]) => [
				command,
				avg.toFixed(2),
				stdev.toFixed(2),
				max.toFixed(2),
			]),
		],
		{
			align: ['l', 'r', 'r', 'r'],
		}
	);
}
