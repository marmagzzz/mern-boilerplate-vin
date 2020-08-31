module.exports = {
    apps : [{
      name: "mern-stack-boilerplate",
      script: "server/server.js",
      instances: "max",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
  }