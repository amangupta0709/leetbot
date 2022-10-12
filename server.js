const express = require('express')
const Discord = require('discord.js')
const mongoose = require("mongoose");
const cors = require('cors')
const questionModel = require('./models')
require('dotenv').config()
const app = express()

const client = new Discord.Client()
mongoose.connect(
  process.env.URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function() {
  console.log("Connected successfully");
});

//cors
app.use(cors())

// body-parser
app.use(express.json())

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

app.post('/api/data', async (req, res) => {
  const data = {
    name: req.body.question,
    url: req.body.url,
    solved_by: req.body.name,
    tags: req.body.tags.split(','),
    difficulty: req.body.difficulty,
  }
  console.log(data)
  const question = new questionModel(data);
  await question.save()
    .catch(() => {
      res.status(400).json({ message: 'Invalid Data' });
    })
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

client.on('message', message => {
  const command = "/show"
  if (!message.content.startsWith(command)) return;
      let args = message.content.substring(command.length).split("/");
      if(!args.length()==3) return message.reply('needs 2 arguements first /d and second /s');

      

      if(args[1][0]=='d'){
        
      }
      else{
        return message.reply('needs 2 arguements first /d and second /s');
      }

      if(args[2][0]=='s'){

      }
      else{
        return message.reply('needs 2 arguements first /d and second /s');
      }

      //  switch (args[0]) {
      //      case 'test':
      //           if(!args[1]) return message.reply('no argument');
      //            if(args[2]) return message.reply('Too many arguments')

      //       if (args[1] === 'one') {
      //           message.channel.send('test one');
      //       } else  if (args[1] === 'two') {
      //           message.channel.send('test two');
      //       } else 
      //           message.channel.send('Invalid arguments')
      //       }
      //       break;
});

client.login(process.env.TOKEN)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
