const express = require('express');

const router = express.Router();

const database = require('../connection/database');

const adminAuth = require('../middlewares/adminAuth');

router.post('/informacoes/save', adminAuth, (request, response) => {
    var endereco_funcionario = request.body.endereco_funcionario;
    var endereco_cep = request.body.endereco_cep;
    var endereco_bairro = request.body.endereco_bairro;
    var endereco_rua = request.body.endereco_rua;
    var endereco_numero = request.body.endereco_numero;

    var rg_funcionario = request.body.rg_funcionario;
    var rg_numero = request.body.rg_numero;
    var rg_orgaoExpedidor = request.body.rg_orgaoExpedidor;
    var rg_dataExpedicao = request.body.rg_dataExpedicao;

    var cpf_funcionario = request.body.cpf_funcionario;
    var cpf_numero = request.body.cpf_numero;

    var sus_funcionario = request.body.sus_funcionario;
    var sus_numero = request.body.sus_numero;

    var titulo_funcionario = request.body.titulo_funcionario;
    var titulo_numeroInscricao = request.body.titulo_numeroInscricao;
    var titulo_zona = request.body.titulo_zona;
    var titulo_uf = request.body.titulo_uf;
    var titulo_municipio = request.body.titulo_municipio;
    var titulo_dataEmissao = request.body.titulo_dataEmissao;

    var ctps_funcionario = request.body.ctps_funcionario;
    var ctps_numero = request.body.ctps_numero;
    var ctps_serie = request.body.ctps_serie;
    var ctps_uf = request.body.ctps_uf;

    var reservista_funcionario = request.body.reservista_funcionario;
    var reservista_ra = request.body.reservista_ra;
    var reservista_filiacaoMae = request.body.reservista_filiacaoMae;
    var reservista_filiacaoPai = request.body.reservista_filiacaoPai;

    var banco_funcionario = request.body.banco_funcionario;
    var banco_agencia = request.body.banco_agencia;
    var banco_tipoConta = request.body.banco_tipoConta;
    var banco_numeroConta = request.body.banco_numeroConta;
    
    database('funcionario_endereco')
        .insert({
            endereco_funcionario: endereco_funcionario,
            endereco_cep: endereco_cep,
            endereco_bairro: endereco_bairro,
            endereco_rua: endereco_rua,
            endereco_numero: endereco_numero,
        }).then(() => {});

    database('funcionario_rg')
        .insert({
            rg_funcionario: rg_funcionario,
            rg_numero: rg_numero,
            rg_orgaoExpedidor: rg_orgaoExpedidor,
            rg_dataExpedicao: rg_dataExpedicao,
        }).then(() => {});

    database('funcionario_cpf')
        .insert({
            cpf_funcionario: cpf_funcionario,
            cpf_numero: cpf_numero,
        }).then(() => {});

    database('funcionario_sus')
        .insert({
            sus_funcionario: sus_funcionario,
            sus_numero: sus_numero,
        }).then(() => {});

    database('funcionario_tituloEleitor')
        .insert({
            titulo_funcionario: titulo_funcionario,
            titulo_numeroInscricao: titulo_numeroInscricao,
            titulo_zona: titulo_zona,
            titulo_uf: titulo_uf,
            titulo_municipio: titulo_municipio,
            titulo_dataEmissao: titulo_dataEmissao,
        }).then(() => {});

    database('funcionario_ctps')
        .insert({
            ctps_funcionario: ctps_funcionario,
            ctps_numero: ctps_numero,
            ctps_serie: ctps_serie,
            ctps_uf: ctps_uf,
        }).then(() => {});

    database('funcionario_reservista')
        .insert({
            reservista_funcionario: reservista_funcionario,
            reservista_ra: reservista_ra,
            reservista_filiacaoMae: reservista_filiacaoMae,
            reservista_filiacaoPai: reservista_filiacaoPai,
        }).then(() => {});

    database('funcionario_banco')
        .insert({
            banco_funcionario: banco_funcionario,
            banco_agencia: banco_agencia,
            banco_tipoConta: banco_tipoConta,
            banco_numeroConta: banco_numeroConta,
        }).then(() => {});

    response.redirect('/funcionarios');
});

module.exports = router;
