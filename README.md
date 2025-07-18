# Connector authentication

Client definitions for the story-schematics service.

[![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/agorastoryverse)](https://twitter.com/agorastoryverse)
[![Discord](https://img.shields.io/discord/1315240114691248138?logo=discord)](https://discord.gg/rp4Qr8cA)

<hr />

![GitHub repo file or directory count](https://img.shields.io/github/directory-file-count/a-novel/connector-story-schematics)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/a-novel/connector-story-schematics)

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/a-novel/connector-story-schematics/main.yaml)
[![codecov](https://codecov.io/gh/a-novel/connector-story-schematics/graph/badge.svg?token=4QYSG479P3)](https://codecov.io/gh/a-novel/connector-story-schematics)

![Coverage graph](https://codecov.io/gh/a-novel/connector-story-schematics/graphs/sunburst.svg?token=4QYSG479P3)

## Installation

> ⚠️ **Warning**: Even though the package is public, GitHub registry requires you to have a Personal Access Token
> with `repo` and `read:packages` scopes to pull it in your project. See
> [this issue](https://github.com/orgs/community/discussions/23386#discussioncomment-3240193) for more information.

Create a `.npmrc` file in the root of your project if it doesn't exist, and make sure it contains the following:

```ini
@a-novel:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${YOUR_PERSONAL_ACCESS_TOKEN}
```

Then, install the package (using pnpm):

```bash
# pnpm config set auto-install-peers true
#  Or
# pnpm config set auto-install-peers true --location project
pnpm add @a-novel/connector-story-schematics
```

## Extra steps

You need to call the init function once for the package to be ready for use:

```ts
import { init } from "@a-novel/connector-story-schematics";

init({
  baseURL: "https://story-schematics.example.com",
});
```
