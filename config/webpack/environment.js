const { environment } = require('@rails/webpacker')
const webpack = require('webpack');

// adds $/jQuery to the webpack environment, for **dependencies** (e.g. jquery-toast-plugin) that require these variables in their source code
environment.plugins.append(
    'Provide',
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
    })
)

module.exports = environment
