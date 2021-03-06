const express = require('express')
const Discord = require('discord.js')
const cors = require('cors')
require('dotenv').config()
const app = express()

const client = new Discord.Client()

//cors
app.use(cors())

// body-parser
app.use(express.json())

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

app.post('/api/data', async (req, res) => {
  const data = {
    question: req.body.question,
    url: req.body.url,
    name: req.body.name,
    tags: req.body.tags,
    difficulty: req.body.difficulty,
  }
  const message = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(data.question)
    .setURL(data.url)
    .setAuthor(data.name)
    .setDescription(data.tags)
    .setThumbnail(
      'https://assets.leetcode.com/static_assets/public/icons/favicon-32x32.png'
    )
    .addFields(
      { name: 'Difficulty', value: data.difficulty },
      { name: '\u200B', value: '\u200B' }
    )
    .setTimestamp()
  channel = await client.channels.fetch('843911491291840567')
  await channel
    .send(message)
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
