import { existsSync } from 'node:fs';
import patch from '../patch/index.js';
import { join } from 'node:path';

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

	// TODO: implement APKTool decoding.
	for (const patchBundle of bundle.default) {
		if (args.e && args.e.includes(patchBundle.name)) {
			console.log(`Ignoring patch ${patchBundle.name}: Already excluded.`);
			continue;
		}

		patch(patchBundle.default);
	}

	console.log('Finished patching.');

    // TODO: implement building + signing
}
