const webpack = require("webpack")
const path = require("path")
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const BUILD = path.resolve(__dirname, 'static/')
const SRC = path.resolve(__dirname, 'src/')

let config = {
	entry: {
		bubbles: [path.resolve(SRC, 'bubbles/index.js'), path.resolve(SRC, 'bubbles/main.scss')],
		"2d": [path.resolve(SRC, '2d/index.js'), path.resolve(SRC, '2d/main.scss')],
		flower: [path.resolve(SRC, 'flower/index.js'), path.resolve(SRC, 'flower/main.scss')]
	},
	output: {
		path: path.resolve(BUILD),
		filename: 'js/[name].js',
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				include: path.resolve(SRC),
				loader: ExtractTextPlugin.extract(["css-loader", "sass-loader"])
			},
			{
				test: /\.jsx?$/,
				include: path.resolve(SRC),
				loader: 'babel-loader',
			},
		]
	},
	plugins: [
		new ExtractTextPlugin({
			filename: 'css/[name].css',
			allChunks: true
		})
	],
}

module.exports = config
