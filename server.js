const express = require('express')
const Discord = require('discord.js')
const mongoose = require("mongoose");
const cors = require('cors')
const questionModel = require('./models')
require('dotenv').config()
const app = express()

const client = new Discord.Client({
  intents: [
    'GUILDS',
    'DIRECT_MESSAGES',
    'GUILD_MESSAGES'
  ],
  partials: ['MESSAGE', 'CHANNEL'],
})
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

const interactionReply = (interaction, message) => {
  client.api.interactions(interaction.id,interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: message,
        },
      }
    })
}

app.post('/api/data', async (req, res) => {
  const data = {
    name: req.body.question,
    url: req.body.url,
    solved_by: req.body.name,
    tags: req.body.tags.split(',').map(item => item.trim()),
    difficulty: req.body.difficulty,
  }
  console.log(data)
  const question = new questionModel(data);
  await question.save()
    .catch(() => {
      res.status(400).json({ message: 'Invalid Data' });
    })
  let topics = data.tags.map((item, i) => `${i + 1}. ${item}`).join("\r\n");
  const message = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(data.name)
    .setURL(data.url)
    .setAuthor(data.solved_by)
    // .setDescription(data.tags)
    .setThumbnail(
      'https://assets.leetcode.com/static_assets/public/icons/favicon-32x32.png'
    )
    .addFields(
      { name: 'Topics', value: `\`\`\`${topics}\`\`\`` },
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

client.ws.on('INTERACTION_CREATE', async interaction => {
  // console.log(interaction)
  if (interaction.data.name == "show" && interaction.channel_id == "1034046646113280040") {
    interaction.data.options.forEach(async item => {
      console.log(item)
      if (item.name == "date") {
        if (item.value.match(/^\d{2}\/\d{2}\/\d{4}$/)===null) {
          interactionReply(interaction,"date format must be dd/mm/yyyy")
        }
        else{
          const [day, month, year] = item.value.split('/');
          const isoFormattedStr = `${year}-${month}-${day}`;
          let dateobj = new Date(isoFormattedStr);
          let nextdateobj = new Date()
          nextdateobj.setDate(dateobj.getDate()+1)
          let res = await questionModel.find({createdAt: {$gte: dateobj, $lt: nextdateobj}});
          console.log(res)
        }
      }
    })
  }
  return
  // let args = message.content.substring(command.length).split("/");
  // if (!args.length() == 3) return message.reply('needs 2 arguements first /s and second /d');

  // if (args[1][0] == 's') {
  //   console.log(args[1])
  //   // res = await questionModel.find({createdAt: })
  // }
  // else {
  //   return message.reply('needs 2 arguements first /s and second /d');
  // }

  // if (args[2][0] == 'd') {
  //   console.log(args[2])
  // }
  // else {
  //   return message.reply('needs 2 arguements first /s and second /d');
  // }

  // channel = await client.channels.fetch('1034046646113280040')


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
