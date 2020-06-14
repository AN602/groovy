const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ElectronReloadPlugin = require('webpack-electron-reload')({
    path: path.join(__dirname, './dist/background.js'),
});

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.ts',
        background: './src/background.ts',
        preload: './src/preload.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                chunks: ['index']
            }
        ),
        ElectronReloadPlugin()
    ],
    target: 'electron-renderer',
    node: {
        __dirname: false,
    }
};