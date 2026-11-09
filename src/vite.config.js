export default {
  // Relative base so the build works under any sub-path (e.g. GitHub Pages /nus-wayang-kulit/)
  base: './',
  build: {
    // Keep bundled JS/CSS out of ./assets, which holds the puppet models loaded at runtime
    assetsDir: 'static'
  },
  server: {
    host: '0.0.0.0', // Listen on all available network interfaces
    port: 5174 // or your specified port
  }
}
