const express = require('express');

const router = express.Router();

const database = require('../connection/database');

const adminAuth = require('../middlewares/adminAuth');

router.get('/funcoes', async (request, response) => {
    await database('departamentos')
            .join('departamento_funcoes', 'departamento_funcoes.funcao_departamento', 'departamentos.departamento_id')
                .select('*')
                    .orderBy('funcao_id', 'desc')
                        .then((funcoes) => {
                            response.render('funcoes/index', {
                                funcoes: funcoes,
                            });
                        });
});

router.get('/funcao/new', async (request, response) => {
    await database('departamentos')
            .select('*')
                .orderBy('departamento_id', 'desc')
                    .then((departamentos) => {
                        response.render('funcoes/new', {
                            departamentos: departamentos,
                        });
                    });
});

router.post('/funcoes/save', async (request, response) => {
    var funcao_nome = request.body.funcao_nome;
    var funcao_departamento = request.body.funcao_departamento;
    
    await database('departamento_funcoes')
            .insert({
                funcao_nome: funcao_nome,
                funcao_departamento: funcao_departamento,
            }).then(() => {
                response.redirect('/funcoes');
            }).catch(() => {
                response.redirect('/funcao/new')
            });
});

router.post('/funcao/delete/:funcao_id', async (request, response) => {
    var funcao_id = request.params.funcao_id;

    if (request.session.user.usuario == 'adm') {
        await database('departamento_funcoes')
                .where('funcao_id', funcao_id)
                    .delete()
                        .then(() => {
                            response.redirect('/funcoes');
                        }).catch(() => {
                            response.redirect('/funcoes');
                        });
    } else {
        response.redirect('/funcoes');
    }
});

router.get('/funcao/edit/:funcao_id', async (request, response) => {
    var funcao_id = request.params.funcao_id;

    await database('departamento_funcoes')
            .where('funcao_id', funcao_id)
                .first()
                    .then((funcao) => {
                        database('departamentos')
                            .select('*')
                                .then((departamentos) => {
                                    response.render('funcoes/edit', {
                                        funcao: funcao,
                                        departamentos: departamentos,
                                    });
                                });
                        });
});

router.post('/funcao/update', async (request, response) => {
    var funcao_id = request.body.funcao_id;
    var funcao_nome = request.body.funcao_nome;
    var funcao_departamento = request.body.funcao_departamento;

    await database('departamento_funcoes')
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

router.post('/funcoes', async (request, response) => {
    var funcao_nome = request.body.funcao_nome;

    await database('departamento_funcoes')
            .where('funcao_nome', 'like', `%${funcao_nome}%`)
                .select('*')
                    .orderBy('funcao_id', 'desc')
                        .then((funcoes) => {
                            response.render('funcoes/index', {
                                funcoes: funcoes,
                            });
                        });
});

module.exports = router;
