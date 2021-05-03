const express = require('express');

const router = express.Router();

const database = require('../connection/database');

const adminAuth = require('../middlewares/adminAuth');

router.get('/funcionarios', adminAuth, (request, response) => {
    database('departamentos')
        .join('departamento_funcoes', 'departamento_funcoes.funcao_departamento', 'departamentos.departamento_id')
            .innerJoin('funcionarios', 'funcionarios.funcionario_funcao', 'departamento_funcoes.funcao_id')
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
    var funcionario_salario = request.body.funcionario_salario;
    var funcionario_dataNascimento = request.body.funcionario_dataNascimento;
    var funcionario_naturalidade = request.body.funcionario_naturalidade;
    var funcionario_email = request.body.funcionario_email;
    var funcionario_telefone = request.body.funcionario_telefone;
    
    database('funcionarios')
        .insert({
            funcionario_nomeCompleto: funcionario_nomeCompleto,
            funcionario_funcao: funcionario_funcao,
            funcionario_salario: funcionario_salario,
            funcionario_dataNascimento: funcionario_dataNascimento,
            funcionario_naturalidade: funcionario_naturalidade,
            funcionario_email: funcionario_email,
            funcionario_telefone: funcionario_telefone,
        }).then(() => {
            database('funcionarios')
                .orderBy('funcionario_id', 'desc')
                    .first()
                        .then((funcionario) => {
                            response.render('funcionarios/informacoes/index', {
                                funcionario: funcionario
                            });
                        });
        }).catch((err) => {
            response.redirect('/funcionario/new');
            console.log(err);   
        });
});

router.get('/data/:id', adminAuth, (request, response) => {
    var id = request.params.id;

    database('departamentos')
        .join('departamento_funcoes', 'departamento_funcoes.funcao_departamento', 'departamentos.departamento_id')
            .innerJoin('funcionarios', 'funcionarios.funcionario_funcao', 'departamento_funcoes.funcao_id')
                .where('funcionario_id', id)
                    .first()
                        .then((user) => {
                            response.render('funcionarios/data', {
                                user: user,
                            });
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

module.exports = router;
