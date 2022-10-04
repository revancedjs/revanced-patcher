export function _constant(type, register, value) {
	return {
		type: 'instruction',
		instructions: [`const${type !== null ? type : ''}`, register, value]
	};
}

export function _return(type, value) {
	return {
		type: 'instruction',
		instructions: [`return${type !== null ? `-${type}` : ''}`, value]
	};
}

export function Return(value) {
	return _return(null, value);
}

export function ReturnWide(value) {
	return _return('wide', value);
}

export function ReturnObject(value) {
	return _return('object', value);
}

export function Constant(register, value) {
	return _constant(null, register, value);
}

export function Constant4Bit(register, value) {
	return _constant('/4', register, value);
}

export function Constant16Bit(register, value) {
	return _constant('/16', register, value);
}
