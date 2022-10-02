import parse from '../opteric.mjs';
import patch from './cli/patch.js';
const args = parse(process.argv.join(' '));

function logHelp() {
	console.log(`revanced.js Patcher Usage
    Arguments:
        -b              Patch bundle. Can be a module installed or a folder.
        -a              The APK file to patch.
        -o              The patched APKs output location.
        -e              Exclude the patches you want. Example: -e patch another-patch yet-another-patch
        -h              Displays this help screen.`);
}

if (Object.keys(args.options).length === 0 || args.flags.includes('h')) {
	logHelp();
} else {
	if (args.options.b) {
		if (!args.options.a || !args.options.o) {
			logHelp();
		} else {
			patch(args.options);
		}
	}
}
