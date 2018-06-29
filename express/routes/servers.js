var express = require('express');
var router = express.Router();

const { Servers, Users, Rewards } = require('../dbObjects');

/* GET listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:id', async function(req, res, next) {
    foundServer = await Servers.find({
        where:
        {
            server_id: req.params.id,
        }
    }).catch((err) => {
        console.error(err)}
    );
    if (!foundServer) { 
        res.status(404).send('There isn\'t a server with that id in our database').end();
        return; 
    }
    allUsers = await Users.findAll({
        where: { server_id: foundServer.server_id},
        order: [['experience', 'DESC']],
    });
    allRewards = await Rewards.findAll({
        where: {server_id: foundServer.server_id},
        order: [['level_gained', 'DESC']],
    });
    if (!allUsers) { res.status(500).send('Couldn\'t find users or rewards')};
    res.status(200).send(JSON.stringify({
        'id': foundServer.server_id,
        'rewards': allRewards,
        'users': allUsers
    }));
});

module.exports = router;
