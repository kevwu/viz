const webpack = require("webpack")
const path = require("path")
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const BUILD = path.resolve(__dirname, 'static/')
const SRC = path.resolve(__dirname, 'src/client/')

let config = {
	entry: {
		bubbles: [path.resolve(SRC, 'bubbles/js/index.js'), path.resolve(SRC, 'bubbles/scss/main.scss')]
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
	]
}

module.exports = config
