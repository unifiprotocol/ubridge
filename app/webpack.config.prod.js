const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ProvidePlugin, container } = require('webpack');
const { ModuleFederationPlugin } = container
const { dependencies } = require('./package.json')
const path = require('path');

module.exports = {
    entry: './src/index',
    mode: 'production',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 3002,
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        plugins: [],
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            scrypt: require.resolve('scrypt-js'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
            },
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [['@babel/preset-react'], '@babel/preset-typescript'],
                },
            },
        ],
    },
    plugins: [
        new ProvidePlugin({
            process: 'process/browser',
            React: 'react'
        }),
        new ModuleFederationPlugin({
            name: 'ubridge',
            filename: 'remoteEntry.js',
            exposes: {
                './Ubridge': './src/App',
            },
            shared: {
                'react': {
                    singleton: true,
                    requiredVersion: dependencies['react'],
                },
                'react-dom': {
                    singleton: true,
                    requiredVersion: dependencies['react-dom'],
                },
                '@unifiprotocol/shell': {
                    singleton: true,
                    requiredVersion: dependencies['@unifiprotocol/shell'],
                },
                '@unifiprotocol/uikit': {
                    singleton: true,
                    requiredVersion: dependencies['@unifiprotocol/uikit'],
                },
            },
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
    ],
};