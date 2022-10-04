import { existsSync } from 'node:fs';
import patch from '../patch/index.js';
import { join } from 'node:path';
import { exec } from 'node:child_process';

export default async function Patch(args) {
	let bundle;
	try {
		bundle = await import(args.b);
	} catch (e) {
		console.log(
			'Could not find the bundle as a module. Trying to find as a folder.'
		);

		if (existsSync(args.b)) {
			console.log('Found as a folder.');
			bundle = await import(
				'file://' + join(process.cwd(), `${args.b}/index.js`)
			);
		} else {
			return console.log('Could not also find as a folder.');
		}
	}

	const decodeProcess = exec(
		`apktool d -o ${join(process.cwd(), 'revancedjs-cache')} --no-res ${join(
			process.cwd(),
			args.a
		)}`
	);
	decodeProcess.stdout.on('data', (msg) => console.log(msg.toString()));
	decodeProcess.stderr.on('data', (msg) => console.error(msg.toString()));

	decodeProcess.on('close', () => {
		for (const patchBundle of bundle.default) {
			if (args.e && args.e.includes(patchBundle.name)) {
				console.log(`Ignoring patch ${patchBundle.name}: Already excluded.`);
				continue;
			}

			patch(patchBundle);
		}

		console.log('Finished patching.');
	});

	// TODO: implement building + signing
}
