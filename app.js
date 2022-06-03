const express = require('express');
var cors = require('cors');
var axios = require('axios');
var qs = require('qs');
require('dotenv').config()

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());

app.use(express.static('public'));


console.log(process.env.SLACK_BOT_TOKEN);


const getAllChannels = () => {
    var config = {
    method: 'get',
    url: 'https://slack.com/api/conversations.list',
    headers: { 
        'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
    }
    };

    return axios(config)
    .then(function (response) {
    // console.log(response.data);
        return response.data;
    })
    .catch(function (error) {
    console.log(error);
    });
}

const getAllUsers = () => {
    var config = {
        method: 'get',
        url: 'https://slack.com/api/users.list',
        headers: { 
          'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
        }
      };
      
      return axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        return response.data
      })
      .catch(function (error) {
        console.log(error);
      });
}

const getChannelMembers = (channelId) => {
    var data = qs.stringify({
   
    });
    var config = {
      method: 'get',
      url: `https://slack.com/api/conversations.members?channel=${channelId}`,
      headers: { 
        'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
      },
      data : data
    };
    
    return axios(config)
    .then(function (response) {
    //   console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}




app.get('/api/channels-info', async function (req, res) {

    const channels = await getAllChannels().then(result => result);
    const allMembers = await getAllUsers().then(result => result);
    // const channelMembers = await getChannelMembers('CS62VCEMB').then(result => result);

    // res.send(allMembers);

    var data = [];

    // channels.channels.forEach( async (channel, index) => {
    for(index = 0; index < channels.channels.length; index++){

        if (index < 10) {
            var channel = channels.channels[index];
            // console.log(channel)
            var channelId = channel.id;
            channelMembers = await getChannelMembers(channelId).then(result => result);

            channelMembers.members.forEach(memberId => {
                var info = {};

                info.channelId = channelId;
                info.channelName = channel.name;
                info.archived = channel.is_archived;
                info.private = channel.is_private;
                info.memberId = memberId;

                allMembers.members.forEach(member => {
                    // console.log('---', member.id);

                    if (memberId === member.id) {
                        info.memberName = member.profile.real_name;
                    }

                });

                data.push(info);
            });

        }

    };

    res.send(data);

})




app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});

