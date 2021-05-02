const express = require('express');

const router = express.Router();

const database = require('../connection/database');

const adminAuth = require('../middlewares/adminAuth');

router.get('/departamentos', adminAuth, (request, response) => {
    database('departamentos')
        .select('*')
            .then((departamentos) => {
                response.render('departamentos/index', {
                    departamentos: departamentos,
                });
            });
});

router.get('/departamento/new', adminAuth, (request, response) => {
    response.render('departamentos/new');
});

router.post('/departamento/save', adminAuth, (request, response) => {
    var departamento_nome = request.body.departamento_nome;
    
    database('departamentos')
        .insert({
            departamento_nome: departamento_nome,
        }).then(() => {
            response.redirect('/departamentos');
        })
});

router.post('/departamento/delete/:departamento_id', adminAuth, (request, response) => {
    var departamento_id = request.params.departamento_id;

    database('departamentos')
        .where('departamento_id', departamento_id)
            .delete()
                .then(() => {
                    response.redirect('/departamentos');
                });
});

router.get('/departamento/edit/:departamento_id', adminAuth, (request, response) => {
    var departamento_id = request.params.departamento_id;

    database('departamentos')
        .where('departamento_id', departamento_id)
            .select('*')
                .then((departamentos) => {
                    response.render('departamentos/edit', {
                        departamentos: departamentos,
                    });
                });
});

router.post('/departamento/update', adminAuth, (request, response) => {
    var departamento_id = request.body.departamento_id;
    var departamento_nome = request.body.departamento_nome;

    database('departamentos')
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
