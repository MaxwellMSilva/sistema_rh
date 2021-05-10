const express = require('express');

const router = express.Router();

const database = require('../connection/database');

const adminAuth = require('../middlewares/adminAuth');

router.get('/funcionarios', adminAuth, (request, response) => {
    database('departamentos')
        .join('departamento_funcoes', 'departamento_funcoes.funcao_departamento', 'departamentos.departamento_id')
            .innerJoin('funcionarios', 'funcionarios.funcionario_funcao', 'departamento_funcoes.funcao_id')
                .orderBy('funcionario_id', 'desc')
                    .select('*')
                        .then((funcionarios) => {
                            response.render('funcionarios/index', {
                                funcionarios: funcionarios,
                            });
                        });
});

router.get('/funcionario/new', adminAuth, (request, response) => {
    database('departamento_funcoes')
        .select('*')
            .then((funcoes) => {
                response.render('funcionarios/new', {
                    funcoes: funcoes,
                });
            });
});

router.post('/funcionario/save', adminAuth, (request, response) => {
    var funcionario_nomeCompleto = request.body.funcionario_nomeCompleto;
    var funcionario_funcao = request.body.funcionario_funcao;
    var funcionario_dataAdmissao = request.body.funcionario_dataAdmissao;
    var funcionario_salario = request.body.funcionario_salario;
    var funcionario_sexo = request.body.funcionario_sexo;
    var funcionario_email = request.body.funcionario_email;
    var funcionario_telefone = request.body.funcionario_telefone;
    
    database('funcionarios')
        .insert({
            funcionario_nomeCompleto: funcionario_nomeCompleto,
            funcionario_funcao: funcionario_funcao,
            funcionario_dataAdmissao: funcionario_dataAdmissao,
            funcionario_salario: funcionario_salario,
            funcionario_sexo: funcionario_sexo,
            funcionario_email: funcionario_email,
            funcionario_telefone: funcionario_telefone,
        }).then(() => {
            database('funcionarios')
                .orderBy('funcionario_id', 'desc')
                    .first()
                        .then((funcionario) => {
                            response.redirect(`/confirm/${funcionario.funcionario_id}`)
                        });
        });
});

router.get('/confirm/:funcionario_id', adminAuth, (request, response) => {
    var funcionario_id = request.params.funcionario_id;

    database('departamentos')
        .join('departamento_funcoes', 'departamento_funcoes.funcao_departamento', 'departamentos.departamento_id')
            .innerJoin('funcionarios', 'funcionarios.funcionario_funcao', 'departamento_funcoes.funcao_id')
                .where('funcionario_id', funcionario_id)
                    .first()
                        .then((funcionario) => {
                            response.render('funcionarios/confirm', {
                                funcionario: funcionario,
                            });
                        });
});

router.get('/data/:funcionario_id', adminAuth, (request, response) => {
    var funcionario_id = request.params.funcionario_id;

    database('departamentos')
        .join('departamento_funcoes', 'departamento_funcoes.funcao_departamento', 'departamentos.departamento_id')
            .innerJoin('funcionarios', 'funcionarios.funcionario_funcao', 'departamento_funcoes.funcao_id')
                .where('funcionario_id', funcionario_id)
                    .first()
                        .then((funcionario) => {
                            response.render('funcionarios/data', {
                                funcionario: funcionario,
                            });
                        });
});

router.get('/funcionario/edit/:funcionario_id', adminAuth, (request, response) => {
    var funcionario_id = request.params.funcionario_id;

    database('funcionarios')
        .where('funcionario_id', funcionario_id)
            .first()
                .then((funcionario) => {
                    database('departamento_funcoes')
                        .select('*')
                            .then((funcoes) => {
                                response.render('funcionarios/edit', {
                                    funcionario: funcionario,
                                    funcoes: funcoes,
                                })
                            })
                });
});

router.post('/funcionario/update', adminAuth, (request, response) => {
    var funcionario_id = request.body.funcionario_id;
    var funcionario_nomeCompleto = request.body.funcionario_nomeCompleto;
    var funcionario_funcao = request.body.funcionario_funcao;
    var funcionario_dataAdmissao = request.body.funcionario_dataAdmissao;
    var funcionario_salario = request.body.funcionario_salario;
    var funcionario_sexo = request.body.funcionario_sexo;
    var funcionario_email = request.body.funcionario_email;
    var funcionario_telefone = request.body.funcionario_telefone;

    database('funcionarios')
        .where('funcionario_id', funcionario_id)
            .update({
                funcionario_id: funcionario_id,
                funcionario_nomeCompleto: funcionario_nomeCompleto,
                funcionario_funcao: funcionario_funcao,
                funcionario_dataAdmissao: funcionario_dataAdmissao,
                funcionario_salario: funcionario_salario,
                funcionario_sexo: funcionario_sexo,
                funcionario_email: funcionario_email,
                funcionario_telefone: funcionario_telefone,
            }).then(() => {
                response.redirect('/funcionarios');
            }).catch(() => {
                response.redirect('/funcionarios');
            });
});

router.post('/funcionario/delete/:funcionario_id', adminAuth, (request, response) => {
    var funcionario_id = request.params.funcionario_id;

    database('funcionarios')
        .where('funcionario_id', funcionario_id)
            .delete()
                .then(() => {
                    response.redirect('/funcionarios');
                });
});

// Refazer Cadastro
router.post('/cadastro/delete/:funcionario_id', adminAuth, (request, response) => {
    var funcionario_id = request.params.funcionario_id;

    database('funcionarios')
        .where('funcionario_id', funcionario_id)
            .delete()
                .then(() => {
                    response.redirect('/funcionario/new');
                });
});

module.exports = router;
