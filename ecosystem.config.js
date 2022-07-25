module.exports = {
    apps : [{
      name   : "sonos-express-doorbell",
      script : "./dist/index.js",
      env: {
        "NODE_ENV": "production",
      }
    }]
  }