const express = require('express');

const router = express.Router();

const database = require('../connection/database');

router.get('/login', (request, response) => {
    response.render('index');
});

router.post('/authenticate', (request, response) => {
    var senha_acesso = request.body.senha_acesso;

    database('adm')
        .where('senha_acesso', senha_acesso)
            .first()
                .then((user) => {
                    if (user != undefined) {
                        if (request.body.senha_acesso != user.senha_acesso) {
                            response.redirect('/login');
                        } else {
                            request.session.user = { id: user.id };
                            response.redirect('/departamentos');
                        }
                    } else {
                        response.redirect('/login');
                    }
                }).catch(() => {
                    response.redirect('/login');
                });
});

router.get('/logout', (request, response) => {
    request.session.user = undefined;
    response.redirect('/login');
});

module.exports = router;
