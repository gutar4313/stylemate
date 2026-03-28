module.exports = {
  apps: [
    {
      name: "stylemate",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/home/master/applications/stylemate/public_html",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
