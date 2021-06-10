const express = require('express');

const router = express.Router();

const database = require('../connection/database');

const adminAuth = require('../middlewares/adminAuth');

router.get('/relatorios', adminAuth, async (request, response) => {
    await database('departamentos')
            .join('departamento_funcoes', 'departamento_funcoes.funcao_departamento', 'departamentos.departamento_id')
                .innerJoin('funcionarios', 'funcionarios.funcionario_funcao', 'departamento_funcoes.funcao_id')
                    .select('*')
                        .orderBy('funcionario_id', 'desc')
                            .then((funcionarios) => {
                                response.render('relatorios/index', {
                                    funcionarios: funcionarios,
                                });
                            });
});

router.post('/relatorios', adminAuth, async (request, response) => {
    var funcionario_nomeCompleto = request.body.funcionario_nomeCompleto;
    var departamento_nome = request.body.departamento_nome;
    var funcionario_dataAdmissao = request.body.funcionario_dataAdmissao;

    await database('departamentos')
            .innerJoin('departamento_funcoes', 'departamento_funcoes.funcao_departamento', 'departamentos.departamento_id')
            .innerJoin('funcionarios', 'funcionarios.funcionario_funcao', 'departamento_funcoes.funcao_id')
                .where('funcionarios.funcionario_nomeCompleto', 'like', `%${funcionario_nomeCompleto}%`)
                .andWhere('funcionarios.funcionario_dataAdmissao', 'like', `%${funcionario_dataAdmissao}%`)
                .andWhere('departamentos.departamento_nome', 'like', `%${departamento_nome}%`)
                    .select('*')
                        .orderBy('funcionario_id', 'desc')
                            .then((funcionarios) => {
                                response.render('relatorios/index', {
                                    funcionarios: funcionarios
                                });
                            });
});

module.exports = router;
