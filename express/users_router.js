module.exports = (Users) => {
    let express = require('express');
    let router = express.Router();

    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcrypt');


    router.post('/onSignup', (req, res) => {
        // TODO: Implement user account creation
            let { username, password } = req.body
            let user = {username, password};

            bcrypt.hash(user.password, 10, function(err, hash) {
                user.hash = hash;
                user.salt = 10;
                var hashUser = new Users(user);
                console.log(hashUser)
                hashUser.save(function (err, hashUser){
                    if (err) { return next(err) }
                    res.json(201, hashUser);}
                )
                console.log(`Hash generated for ${user.username}`, user);
            });




    });



    router.put('/', (req, res) => {
        // TODO: Implement user update (change password, etc).
        users.forEach(user => {
            bcrypt.hash(user.password, 10, function(err, hash) {
                user.hash = hash;
                console.log(`Hash generated for ${user.username}`, user);
            });
        });
        res.status(501).json({msg: "PUT update user not implemented"});
    });

    router.post('/authenticate', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            let msg = "Username or password missing!";
            console.error(msg);
            res.status(401).json({msg: msg});
            return;
        }
        console.log("hej")
        console.log(password)
        Users.findOne({username: username}, (err, user) => {
            if (user) {
                console.log(user)
                bcrypt.compare(password, user.hash, (err, result) => {
                    if (result) {
                        const payload = {
                            username: username,
                            admin: false
                        };
                        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

                        res.json({
                            msg: 'User authenticated successfully',
                            token: token
                        });
                    }
                    else res.status(404).json({msg: "Password mismatch!"})
                });
            } else {
                res.status(404).json({msg: "User not found!"});
            }
        });
        });


    return router;
};