const glob = require('glob');
const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const generateHTMLPlugins = () =>
	glob.sync('./src/**/*.html').map(
		(dir) =>
			new HTMLWebpackPlugin({
				filename: path.basename(dir), // Output
				template: dir, // Input
			})
	);

module.exports = {
	node: {
		fs: 'empty',
	},
	entry: {
		'app': ['./src/js/app.js', './src/scss/main.scss'],
		'sw': './src/sw.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "[name].js",
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
			},
			{
				test: /\.html$/,
				loader: 'raw-loader',
			},
			{
				test: /\.(pdf|gif|png|jpe?g|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'static/',
						},
					},
				],
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/',
						},
					},
				],
			},
		],
	},
	plugins: [
		new CopyWebpackPlugin([
			{
				from: './src/static/',
				to: './static/',
			},
		]),
		...generateHTMLPlugins(),
	],
	stats: {
		colors: true,
	},
	devtool: 'source-map',
};
