const router = require('express').Router();
const passport = require('../services/passport');
const { registerUser, loginUser } = require('../controllers/auth');
const { verifyToken } = require('../middlewares/verifyToken');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Organization = require('../models/Organization');
const Message = require('../models/Message');
const {getOrg} = require('../middlewares/getOrg');

router.get('/', (req, res) => {
    res.send("Welcome to FB Helpdesk API!")
});

router.post('/auth/register', registerUser)
router.post('/auth/login', loginUser)

router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'public_profile', 'pages_show_list', 'pages_messaging', 'pages_manage_metadata']
}));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: `${process.env.CLIENT_URL}/login?success=false`,
        session: false
    }), (req, res) => {
        return res.redirect(`${process.env.CLIENT_URL}/process?success=true&profileId=${req.profileId}`)
});

router.post('/auth/process', verifyToken, (req, res) => {
    console.log("-----")
    if(req.user.password != null &&req.body.profileId) {
        Organization.findOne({profileId: req.body.profileId}).then(org => {
            if(org){
                User.findOneAndUpdate({_id: req.user._id}, {organizationId: org._id}).then(user => {
                    res.status(200).json({ success: true, message: "Organization connected"})
                })
            }else{
                res.status(404).json({ success: false, message: "Organization not found" })
            }
        })
    }else if(req.user.password == null){
        res.status(400).json({ success: false, message: "User not registered" })
    }
})

router.get('/auth/verify', verifyToken, (req, res) => {
    if(req.user.password != null && req.user.organizationId != null){
        res.status(200).json({ success: true, message: "User verified", connected: true, user: req.user})
    }else if(req.user.password != null){
        res.status(200).json({ success: true, message: "User verified", connected: false, user: req.user})
    }else{
        res.status(400).json({ success: false, message: "User not registered" })
    }
})

router.get('/delete', verifyToken, (req, res) => {
    if(req.user.organizationId != null){
        User.updateMany({organizationId: req.user.organizationId}, {organizationId: null}).then((user) => {
            res.status(200).json({ success: true, message: "Integration Deleted"})
        })
    }
})

router.post('/invite', verifyToken, (req, res) => {
    if(req.user.organizationId != null){
        User.findOne({email: req.body.email}).then(user => {
            if(user && user.organizationId != null){
                res.status(200).json({ success: false, message: "User already exists"})
            }else if(user){
                user.organizationId = req.user.organizationId;
                user.save().then(() => {
                    res.status(200).json({ success: true, message: "User added successfully"})
                })
            }else{
                let newUser = new User({
                    email: req.body.email,
                    organizationId: req.user.organizationId
                })
                newUser.save().then(() => {
                    res.status(200).json({ success: true, message: "User added successfully"})
                })
            }
        })
    }
})

router.get('/userDetails', verifyToken, getOrg, (req, res) => {
    if(req.query.userId != null){
        User.findById(req.query.userId).then(user => {
            if(user){
                res.status(200).json({ success: true, user: user})
            }else{
                res.status(404).json({ success: false, message: "User not found" })
            }
        })
    }else if(req.user && req.user.organizationId != null){
        const user = {
            ...req.user,
            organizationId: {
                _id: req.user.organizationId._doc._id,
                pageName: req.user.organizationId._doc.pageName,
                pageId: req.user.organizationId._doc.pageId,
            }
        }
        res.status(200).json({ success: true, user:user, connected: true})
    }else{
        res.status(404).json({ success: false, message: "User not found" })
    }
})

router.get('/conversations', verifyToken, getOrg, (req, res) => {
    Conversation.find({pageId: req.user.organizationId.pageId}).populate('messages').then(conversations => {
        res.status(200).json({ success: true, conversations: conversations })
    })
})
router.post('/conversations/reply', verifyToken, getOrg, (req, res) => {
    Conversation.findOne({ _id: req.body.conversationId }).then(conversation => {
        fetch(`${process.env.FACEBOOK_API_URL}/${req.user.organizationId.pageId}/messages?access_token=${req.user.organizationId.pageAccessToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_type: 'RESPONSE',
                recipient: {
                    id: conversation.sender_id
                },
                message: {
                    text: req.body.message
                }
            })
        })
            .then(response => response.json())
            .then(data => {
                if(data.message_id){
                    const msg = new Message({
                        messageId: data.message_id,
                        message: req.body.message,
                        timestamp: new Date().getTime(),
                        isSenderAgent: true,
                        agentName: req.user.name,
                        senderId: req.user._id,
                        recipientId: conversation.sender_id,
                    })
                    msg.save().then((msg) => {
                        conversation.messages.push(msg._id)
                        conversation.lastUpdated = new Date();
                        conversation.save().then(async (conversation) => {
                            res.status(200).json({ success: true, message: "Message sent", conversation: await conversation.populate('messages') })
                        })
                    })

                }
            })
    })
})

router.post('/messaging-webhook', (req, res) => {
    console.dir(req.body, {depth: null})
    if (req.body.object === "page") {
        let data = req.body.entry[0].messaging[0];
        let senderId = data.sender.id;
        let message = data.message.text;
        let timestamp = data.timestamp;
        let pageId = data.recipient.id;
        let messageId = data.message.mid;
        Conversation.findOne({
            pageId: pageId,
            sender_id: senderId
        }).then((conversation) => {
            if (conversation) {
                const msg = new Message({
                    messageId: messageId,
                    message: message,
                    timestamp: timestamp,
                    isSenderAgent: false,
                    senderId: senderId,
                    recipientId: pageId,
                })
                msg.save().then((msg) => {
                    conversation.messages.push(msg._id)
                    conversation.lastUpdated = new Date();
                    conversation.save().then(() => {
                        console.log("Conversation updated")
                        req.io.emit(`new-message-${pageId}`)
                        res.status(200).send("EVENT_RECEIVED");
                    })
                })
            } else {
                Organization.findOne({pageId: pageId}).then(org => {
                    fetch(`${process.env.FACEBOOK_API_URL}/${senderId}?fields=first_name,last_name,profile_pic&access_token=${org.pageAccessToken}`)
                        .then(response => response.json())
                        .then((data) => {
                            const msg = new Message({
                                messageId: messageId,
                                message: message,
                                timestamp: timestamp,
                                isSenderAgent: false,
                                senderId: senderId,
                                recipientId: pageId,
                            })
                            msg.save().then((msg) => {
                                const newConversation = new Conversation({
                                    pageId: pageId,
                                    sender_id: senderId,
                                    sender_name: `${data.first_name} ${data.last_name}`,
                                    sender_picture: data.profile_pic,
                                    lastUpdated: new Date()
                                })
                                newConversation.messages.push(msg._id)
                                newConversation.save().then((conversation) => {
                                    conversation.save().then(() => {
                                        console.log("Conversation created")
                                        req.io.emit(`new-message-${pageId}`)
                                        res.status(200).send("EVENT_RECEIVED");
                                    })
                                })
                            })
                        })
                })
            }
        })
    } else {
        res.sendStatus(404);
    }
})

router.get("/messaging-webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === "mytoken") {
          console.log("WEBHOOK_VERIFIED");
          res.status(200).send(challenge);
        } else {
          res.sendStatus(403);
        }
    }
});

module.exports = router;