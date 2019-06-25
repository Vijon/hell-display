module.exports = {
    staticFileGlobs: [
        'build/static/css/**.css',
        'build/static/js/**.js'
    ],
    swFilePath: './build/service-worker.js',
    stripPrefix: 'build/',
    handleFetch: false,
    importScripts: (['./service-worker-webpush.js']),
    handleFetch: false
}