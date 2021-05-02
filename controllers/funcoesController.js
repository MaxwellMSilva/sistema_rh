const express = require('express');

const router = express.Router();

const database = require('../connection/database');

const adminAuth = require('../middlewares/adminAuth');

router.get('/funcoes', adminAuth, (request, response) => {
    database('departamentos')
        .join('departamento_funcoes', 'departamento_funcoes.funcao_departamento', 'departamentos.departamento_id')
            .select('*')
                .then((funcoes) => {
                    response.render('funcoes/index', {
                        funcoes: funcoes,
                    });
                });
});

router.get('/funcao/new', adminAuth, (request, response) => {
    database('departamentos')
        .select('*')
            .then((departamentos) => {
                response.render('funcoes/new', {
                    departamentos: departamentos,
                });
            });
});

router.post('/funcoes/save', adminAuth, (request, response) => {
    var funcao_nome = request.body.funcao_nome;
    var funcao_departamento = request.body.funcao_departamento;
    
    database('departamento_funcoes')
        .insert({
            funcao_nome: funcao_nome,
            funcao_departamento: funcao_departamento,
        }).then(() => {
            response.redirect('/funcoes');
        }).catch(() => {
            response.redirect('/funcao/new')
        });
});

router.post('/funcao/delete/:funcao_id', adminAuth, (request, response) => {
    var funcao_id = request.params.funcao_id;

    database('departamento_funcoes')
        .where('funcao_id', funcao_id)
            .delete()
                .then(() => {
                    response.redirect('/funcoes');
                });
});

router.get('/funcao/edit/:funcao_id', adminAuth, (request, response) => {
    var funcao_id = request.params.funcao_id;

    database('departamento_funcoes')
        .where('funcao_id', funcao_id)
            .select('*')
                .then((funcoes) => {
                    database('departamentos')
                        .select('*')
                            .then(departamentos => {
                                response.render('funcoes/edit', {
                                    funcoes: funcoes,
                                    departamentos: departamentos,
                                });
                            });
                });
});

router.post('/funcao/update', adminAuth, (request, response) => {
    var funcao_id = request.body.funcao_id;
    var funcao_nome = request.body.funcao_nome;
    var funcao_departamento = request.body.funcao_departamento;

    database('departamento_funcoes')
        .where('funcao_id', funcao_id)
            .update({
                funcao_nome: funcao_nome,
                funcao_departamento: funcao_departamento,
            }).then(() => {
                response.redirect('/funcoes');
            }).catch(() => {
                response.redirect('/funcoes');
            });
});

module.exports = router;
