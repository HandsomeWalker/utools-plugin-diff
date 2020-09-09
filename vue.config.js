const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    productionSourceMap: false,
    publicPath: "",
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin([{from: "README.md", to: ""}])
        ]
    }
}