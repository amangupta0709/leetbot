const express = require('express')
const Discord = require('discord.js')
require('dotenv').config()
const app = express()

const client = new Discord.Client()

// body-parser
app.use(express.json())

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

app.post('/api/data', async (req, res) => {
  channel = await client.channels.fetch('843911491291840567')
  await channel
    .send(
      `name: ${req.body.name}\ndifficulty: ${req.body.difficulty}\nurl: ${req.body.url}`
    )
    .then(() => {
      res.status(200).json({ message: 'data sent!' })
    })
    .catch(() => {
      res.status(400).json({ message: 'Invalid request' })
    })
})

client.login(process.env.TOKEN)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
