Rainbow.extend('javascript', [
	{
        'matches': {
            1: 'keyword',
            2: 'entity.function.needles'
        },
        'pattern': /\s*(new)\s+(Needles)(?=\()/g
    }
]);
