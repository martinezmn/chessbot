## ♟️ Chessbot

**Chessbot** is an **in-progress** project that allows Discord users to easily start and play chess games with their friends. Using simple bot commands, users can create private game rooms and invite their Discord friends to play via a web interface.

#### Stack

- [NestJS](https://github.com/nestjs/nest): Backend framework powering the bot and web interface.
- [discord.js](https://github.com/discordjs/discord.js): Handles bot commands and Discord API interactions.
- [socket.io](https://github.com/socketio/socket.io): Enables real-time communication between players.
- [Prisma](https://github.com/prisma/prisma): ORM for flexible and easy-to-maintain database interaction.
- [ejs](https://github.com/mde/ejs): Templating engine for rendering the web interface.

## 🚀 Project setup

```bash
# Install dependencies
$ npm install

# Set up environment variables
$ cp .env.example .env
```

Edit the `.env` file and provide your credentials:

- `DISCORD_BOT_TOKEN`: Your Discord bot token
- `DISCORD_DEVELOPMENT_GUILD_ID`: Your Discord server guild ID

Manage your Discord applications through the [Discord Developer Portal](https://discord.com/developers/applications)

## 🧪 Compile and run the project

```bash
# Database Setup
$ npx prisma generate
$ npx prisma migrate dev

# Development Mode
$ npm run start:dev

# Production Mode
$ npm run start:prod
```

## 🎮 How to Use

1. Add the bot to your Discord server.

2. Use the `/game` command in any text channel.

3. The bot creates a private game room and provides a **Join Game** button.

## 📌 Notes

- Chessbot is currently under active development.
- Pull requests and suggestions are welcome!
