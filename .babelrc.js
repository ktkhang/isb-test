module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					node: 'current',
				},
			},
		],
	],
	plugins: [
		'@babel/plugin-proposal-object-rest-spread',
		'@babel/plugin-proposal-optional-chaining',
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-nullish-coalescing-operator',
		[
			'@babel/plugin-transform-runtime',
			{
				regenerator: true,
			},
		],
	],
};
