import getFingerPrint from '../fingerprints/index.js';
import Patch from './Patch.js';

export default function patch(options) {
	if (options.fingerprint) {
		const fingerprint = getFingerPrint(options.fingerprint);
		if (!fingerprint)
			return console.log(`Fingerprint failed for "${options.name}".`);
		const patch = new Patch(fingerprint);

		options.patch(patch);
	} else {
		throw new Error('Patching without fingerprints isn\'t implemented.');
	}
}
