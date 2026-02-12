<p align="center">
  <img src="https://content.syncfuse.io/website/images/syncfuse-logo.png" alt="Syncfuse Logo" width="100">
</p>

<h1 align="center">Syncfuse</h1>

<p align="center">
  <i>Syncfuse is a simple, fast, privacy-focused alternative to Google Analytics.</i>
</p>

<p align="center">
  <a href="https://github.com/syncfuse/syncfuse/releases"><img src="https://img.shields.io/github/release/syncfuse/syncfuse.svg" alt="GitHub Release" /></a>
  <a href="https://github.com/syncfuse/syncfuse/blob/master/LICENSE"><img src="https://img.shields.io/github/license/syncfuse/syncfuse.svg" alt="MIT License" /></a>
  <a href="https://github.com/syncfuse/syncfuse/actions"><img src="https://img.shields.io/github/actions/workflow/status/syncfuse/syncfuse/ci.yml" alt="Build Status" /></a>
  <a href="https://analytics.syncfuse.io/share/demo" style="text-decoration: none;"><img src="https://img.shields.io/badge/Try%20Demo%20Now-Click%20Here-brightgreen" alt="Syncfuse Demo" /></a>
</p>

---

## 🚀 Getting Started

A detailed getting started guide can be found at [syncfuse.io/docs](https://syncfuse.io/docs/).

---

## 🛠 Installing from Source

### Requirements

- A server with Node.js version 18.18+.
- A PostgreSQL database version v12.14+.

### Get the source code and install packages

```bash
git clone https://github.com/syncfuse/syncfuse.git
cd syncfuse
pnpm install
```

### Configure Syncfuse

Create an `.env` file with the following:

```bash
DATABASE_URL=connection-url
```

The connection URL format:

```bash
postgresql://username:mypassword@localhost:5432/mydb
```

### Build the Application

```bash
pnpm run build
```

The build step will create tables in your database if you are installing for the first time. It will also create a login user with username **syncfuse** and password **syncfuse**.

### Start the Application

```bash
pnpm run start
```

By default, this will launch the application on `http://localhost:3000`. You will need to either [proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) requests from your web server or change the [port](https://nextjs.org/docs/api-reference/cli#production) to serve the application directly.

---

## 🐳 Installing with Docker

Syncfuse provides Docker images as well as a Docker compose file for easy deployment.

Docker image:

```bash
docker pull docker.syncfuse.io/syncfuse/syncfuse:latest
```

Docker compose (Runs Syncfuse with a PostgreSQL database):

```bash
docker compose up -d
```

---

## 🔄 Getting Updates

To get the latest features, simply do a pull, install any new dependencies, and rebuild:

```bash
git pull
pnpm install
pnpm build
```

To update the Docker image, simply pull the new images and rebuild:

```bash
docker compose pull
docker compose up --force-recreate -d
```

---

## 🛟 Support

<p align="center">
  <a href="https://github.com/syncfuse/syncfuse"><img src="https://img.shields.io/badge/GitHub--blue?style=social&logo=github" alt="GitHub" /></a>
  <a href="https://twitter.com/syncfuse"><img src="https://img.shields.io/badge/Twitter--blue?style=social&logo=twitter" alt="Twitter" /></a>
  <a href="https://linkedin.com/company/syncfuse"><img src="https://img.shields.io/badge/LinkedIn--blue?style=social&logo=linkedin" alt="LinkedIn" /></a>
  <a href="https://syncfuse.io/discord"><img src="https://img.shields.io/badge/Discord--blue?style=social&logo=discord" alt="Discord" /></a>
</p>

[release-shield]: https://img.shields.io/github/release/syncfuse/syncfuse.svg
[releases-url]: https://github.com/syncfuse/syncfuse/releases
[license-shield]: https://img.shields.io/github/license/syncfuse/syncfuse.svg
[license-url]: https://github.com/syncfuse/syncfuse/blob/master/LICENSE
[build-shield]: https://img.shields.io/github/actions/workflow/status/syncfuse/syncfuse/ci.yml
[build-url]: https://github.com/syncfuse/syncfuse/actions
[github-shield]: https://img.shields.io/badge/GitHub--blue?style=social&logo=github
[github-url]: https://github.com/syncfuse/syncfuse
[twitter-shield]: https://img.shields.io/badge/Twitter--blue?style=social&logo=twitter
[twitter-url]: https://twitter.com/syncfuse
[linkedin-shield]: https://img.shields.io/badge/LinkedIn--blue?style=social&logo=linkedin
[linkedin-url]: https://linkedin.com/company/syncfuse
[discord-shield]: https://img.shields.io/badge/Discord--blue?style=social&logo=discord
[discord-url]: https://discord.com/invite/syncfuse
