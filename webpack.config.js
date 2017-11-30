const webpack = require("webpack")
const path = require("path")
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const BUILD = path.resolve(__dirname, 'static/')
const SRC = path.resolve(__dirname, 'src/')

const NAMES = ["bubbles", "2d", "flower", "svg"]

let config = {
	entry: NAMES.reduce((prev, name) => {
		prev[name] = [path.resolve(SRC, name + "/index.js"), path.resolve(SRC, name + '/main.scss')]
		return prev
	}, {}),
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
