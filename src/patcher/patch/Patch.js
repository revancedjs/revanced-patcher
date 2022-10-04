import { toObject, toSmali } from '../../smaliParser/parser.js';
import { writeFileSync } from 'node:fs';
import Instructions from '../../smaliParser/Instructions.js';

class Patch {
	constructor(options) {
		this.smaliObj = options.smaliObject;
		this.index = options.index;
		this.path = options.path;
		this.instructions = Instructions;
	}

	insertInstruction(index, instruction) {
		index = this.index + index;
		if (this.smaliObj[index].type === 'type') index++;

		if (typeof instruction === 'object') {
			if (Array.isArray(instruction))
				throw new TypeError(
					'The patch uses Arrays while inserting one instruction. Please use "insertInstructions" for this.'
				);
			else {
				this.smaliObj.splice(index, 0, instruction);
			}
		} else if (typeof instruction === 'string') {
			const instruc = toObject(instruction);
			if (instruc.length > 1)
				throw new SyntaxError(
					'There are more instructions given to "insertInstruction". Please use "insertInstructions" for this.'
				);
		}
	}

	insertInstructions(index, instructions) {
		index = this.index + index;
		if (this.smaliObj[index].type === 'type') index++;

		if (typeof instructions === 'object') {
			if (!Array.isArray(instructions))
				throw new TypeError(
					'The patch uses Objects while inserting one instruction. Please use "insertInstruction" for this.'
				);
			else {
				this.smaliObj.splice(index, 0, ...instructions);
			}
		} else if (typeof instructions === 'string') {
			const instruc = toObject(instructions);
			if (instruc.length === 1 || instruc < 1)
				throw new SyntaxError(
					'There is only one instruction given to "insertInstructions". Please use "insertInstruction" for this.'
				);

			this.smaliObj.splice(index, 0, ...instructions);
		}
	}

	save() {
		const smali = toSmali(this.smaliObj);
		writeFileSync(this.path, smali);
	}
}

export default Patch;
