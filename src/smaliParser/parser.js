// A really basic parser.
import { EOL } from 'node:os';

function toObject(src) {
	const lines = src.split(EOL);
	const parsedObj = [];

	for (const line of lines) {
		if (line.startsWith('#')) {
			parsedObj.push({
				type: 'comment',
				content: line
			});

			continue;
		} else {
			const instructionLine = line.replace('    ', '');
			const instructions = instructionLine.split(' ');
			if (instructions.length === 1 && instructions[0] === '') continue;

			for (
				let i = 0, parsedWord = '', isParsing = false, indexs = [];
				i < instructions.length;
				i++
			) {
				let instruction = instructions[i];

				if (instruction.startsWith('{') || instruction.startsWith('"')) {
					if (instruction.startsWith('"')) {
						const nowhsp = instruction.replace(/\s/g, '');
						if (nowhsp.endsWith('"') || nowhsp.endsWith('",')) continue;
					}
					if (instruction.replace(/\s/gi, '') === '{') continue;
					parsedWord += instruction + ' ';
					indexs.push(i);
					isParsing = true;
					continue;
				}

				if (isParsing) {
					if (!instruction.endsWith('},') || !instruction.endsWith('"'))
						parsedWord += instruction + ' ';
					indexs.push(i);
				}

				if (instruction.endsWith('},') || instruction.endsWith('"')) {
					isParsing = false;
					parsedWord += instruction;
					let firstIndex = true;
					let num = 0;
					for (const index of indexs) {
						if (firstIndex) {
							firstIndex = false;
							instructions.splice(index, 1, parsedWord);
						} else {
							instructions.splice(index - num, 1);
							num++;
						}
					}
				}
			}
			if (instructions[0].startsWith('.')) {
				parsedObj.push({
					type: 'type',
					types: instructions
				});
			} else {
				parsedObj.push({
					type: 'instruction',
					instructions: instructions
				});
			}
		}
	}

	return parsedObj;
}

function toSmali(arrayObject) {
	let smaliFile = '';
	for (const instruction of arrayObject) {
		switch (instruction.type) {
		case 'type': {
			const inst = instruction.types.join(' ');
			smaliFile += `${inst}${EOL}`;
			break;
		}

		case 'instruction': {
			const inst = instruction.instructions.join(' ');
			smaliFile += `    ${inst}${EOL}${EOL}`;
			break;
		}

		case 'comment': {
			smaliFile += `${instruction.content}${EOL}${EOL}`;
		}
		}
	}

	return smaliFile;
}

export { toObject, toSmali };
