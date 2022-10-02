import { readFileSync, existsSync } from 'node:fs';
import { toObject } from '../../smaliParser/parser.js';

export default function getFingerPrint(fingerprint) {
	const path = `reddit/smali_classes${fingerprint.classDexNumber}/${fingerprint.path}`;
	if (!existsSync(path)) {
		console.log(
			'Could not find the class file! Did you input the wrong class number?'
		);
		return null;
	}
	const file = readFileSync(path, 'utf8');
	const smaliObject = toObject(file);

	const index = fingerprint.find(smaliObject);

    if (index === -1) {
		console.log('Fingerprint did not match! Is the fingerprint broken?');
		return null;
	} else return { index, smaliObject, path };
}
