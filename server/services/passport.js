const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const Organization = require('../models/Organization');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    done(null, id);
})

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.SERVER_URL}/api/auth/facebook/callback`,
        passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, cb) => {
        req.profileId = profile.id;
        Organization.findOne({profileId: profile.id}).then(org => {
            if(org){
                return cb(null, profile)
            }else{
                fetch(`${process.env.FACEBOOK_API_URL}/me/accounts?access_token=${accessToken}`)
                    .then(response => response.json())
                    .then(data => {
                        const newOrg = new Organization({
                            profileId: profile.id,
                            name: profile.displayName,
                            accessToken: accessToken,
                            pageId: data.data[0].id,
                            pageName: data.data[0].name,
                            pageAccessToken: data.data[0].access_token
                        })
                        newOrg.save().then(() => {
                            return cb(null, profile)
                        })
                    })
            }
        })
    }
));

module.exports = passport;