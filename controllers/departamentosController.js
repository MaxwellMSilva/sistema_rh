const express = require('express');

const router = express.Router();

const database = require('../connection/database');

const adminAuth = require('../middlewares/adminAuth');

router.get('/departamentos', adminAuth, async (request, response) => {
    await database('departamentos')
            .orderBy('departamento_id', 'desc')
                .select('*')
                    .then((departamentos) => {
                        response.render('departamentos/index', {
                            departamentos: departamentos,
                        });
                    });
});

router.get('/departamento/new', adminAuth, async (request, response) => {
    await response.render('departamentos/new');
});

router.post('/departamento/save', adminAuth, async (request, response) => {
    var departamento_nome = request.body.departamento_nome;

    await database('departamentos')
            .insert({
                departamento_nome: departamento_nome,
            }).then(() => {
                response.redirect('/departamentos');
            });
});

router.post('/departamento/delete/:departamento_id', adminAuth, async (request, response) => {
    var departamento_id = request.params.departamento_id;

    if (request.session.user.usuario == 'adm') {
        await database('departamentos')
                .where('departamento_id', departamento_id)
                    .delete()
                        .then(() => {
                            response.redirect('/departamentos');
                        }).catch(() => {
                            response.redirect('/departamentos');
                        });
    } else {
        response.redirect('/departamentos');
    }
});

router.get('/departamento/edit/:departamento_id', adminAuth, async (request, response) => {
    var departamento_id = request.params.departamento_id;

    await database('departamentos')
            .where('departamento_id', departamento_id)
                .first()
                    .then((departamento) => {
                        response.render('departamentos/edit', {
                            departamento: departamento,
                        });
                    });
});

router.post('/departamento/update', adminAuth, async (request, response) => {
    var departamento_id = request.body.departamento_id;
    var departamento_nome = request.body.departamento_nome;

    await database('departamentos')
            .where('departamento_id', departamento_id)
                .update({
                    departamento_nome: departamento_nome,
                }).then(() => {
                    response.redirect('/departamentos');
                }).catch(() => {
                    response.redirect('/departamentos')
                });
});

module.exports = router;
