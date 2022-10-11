import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { toObject } from '../../smaliParser/parser.js';

function exists(dir, fingerprint) {
	return existsSync(
		join(process.cwd(), `revancedjs-cache/${dir}/${fingerprint.path}`)
	);
}

export default function getFingerPrint(fingerprint) {
	const fingerprintResult = {
		found: false,
		index: 'smali'
	};
	for (const folderName of readdirSync(
		join(process.cwd(), 'revancedjs-cache')
	)) {
		if (folderName.startsWith('smali')) {
			if (folderName === 'smali') {
				if (exists(folderName, fingerprint)) {
					fingerprintResult.found = true;
				}
			} else {
				if (exists(folderName, fingerprint)) {
					fingerprintResult.found = true;
					fingerprintResult.index = folderName;
				}
			}
		}
	}

	if (!fingerprintResult.found) {
		console.log(
			'Could not find the class file! Did you input the wrong class number?'
		);
		return null;
	}
	const path = join(
		process.cwd(),
		`revancedjs-cache/${fingerprintResult.index}/${fingerprint.path}`
	);
	const file = readFileSync(path, 'utf8');
	const smaliObject = toObject(file);

	const index = fingerprint.find(smaliObject);

	if (index === -1) {
		console.log('Fingerprint did not match! Is the fingerprint broken?');
		return null;
	} else return { index, smaliObject, path };
}
