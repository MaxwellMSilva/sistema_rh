const express = require('express');

const router = express.Router();

const database = require('../connection/database');

const adminAuth = require('../middlewares/adminAuth');

router.get('/funcionarios', adminAuth, async (request, response) => {
    await database('departamentos')
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

router.get('/funcionario/new', adminAuth, async (request, response) => {
    await database('departamento_funcoes')
            .select('*')
                .orderBy('funcao_id', 'desc')
                    .then((funcoes) => {
                        response.render('funcionarios/new', {
                            funcoes: funcoes,
                        });
                    });
});

router.post('/funcionario/save', adminAuth, async (request, response) => {
    var funcionario_nomeCompleto = request.body.funcionario_nomeCompleto;
    var funcionario_funcao = request.body.funcionario_funcao;
    var funcionario_dataAdmissao = request.body.funcionario_dataAdmissao;
    var funcionario_salario = request.body.funcionario_salario;
    var funcionario_sexo = request.body.funcionario_sexo;
    var funcionario_email = request.body.funcionario_email;
    var funcionario_telefone = request.body.funcionario_telefone;
    
    var endereco_cep = request.body.endereco_cep;
    var endereco_bairro = request.body.endereco_bairro;
    var endereco_rua = request.body.endereco_rua;
    var endereco_numero = request.body.endereco_numero;

    var rg_numero = request.body.rg_numero;
    var rg_orgaoExpedidor = request.body.rg_orgaoExpedidor;
    var rg_dataExpedicao = request.body.rg_dataExpedicao;
    var rg_naturalidade = request.body.rg_naturalidade;
    var rg_dataNascimento = request.body.rg_dataNascimento;
    var rg_filiacao = request.body.rg_filiacao;

    var cpf_numero = request.body.cpf_numero;

    var sus_numero = request.body.sus_numero;

    var titulo_numeroInscricao = request.body.titulo_numeroInscricao;
    var titulo_zona = request.body.titulo_zona;
    var titulo_uf = request.body.titulo_uf;
    var titulo_municipio = request.body.titulo_municipio;
    var titulo_dataEmissao = request.body.titulo_dataEmissao;

    var ctps_numero = request.body.ctps_numero;
    var ctps_serie = request.body.ctps_serie;
    var ctps_uf = request.body.ctps_uf;

    var reservista_ra = request.body.reservista_ra;

    var banco_agencia = request.body.banco_agencia;
    var banco_tipoConta = request.body.banco_tipoConta;
    var banco_numeroConta = request.body.banco_numeroConta;

    try {
        await database.transaction(async transaction => {

            await database('funcionarios')
                    .insert({
                        funcionario_nomeCompleto: funcionario_nomeCompleto,
                        funcionario_funcao: funcionario_funcao,
                        funcionario_dataAdmissao: funcionario_dataAdmissao,
                        funcionario_salario: funcionario_salario,
                        funcionario_sexo: funcionario_sexo,
                        funcionario_email: funcionario_email,
                        funcionario_telefone: funcionario_telefone,
                    }).transacting(transaction);

            await database('funcionario_endereco')
                    .insert({
                        endereco_cep: endereco_cep,
                        endereco_bairro: endereco_bairro,
                        endereco_rua: endereco_rua,
                        endereco_numero: endereco_numero,
                    }).transacting(transaction);
    
            await database('funcionario_rg')
                    .insert({
                        rg_numero: rg_numero,
                        rg_orgaoExpedidor: rg_orgaoExpedidor,
                        rg_dataExpedicao: rg_dataExpedicao,
                        rg_naturalidade: rg_naturalidade,
                        rg_dataNascimento: rg_dataNascimento,
                        rg_filiacao: rg_filiacao,
                    }).transacting(transaction);

            await database('funcionario_cpf')
                    .insert({
                        cpf_numero: cpf_numero,
                    }).transacting(transaction);

            await database('funcionario_sus')
                    .insert({
                        sus_numero: sus_numero,
                    }).transacting(transaction);

            await database('funcionario_tituloEleitor')
                    .insert({
                        titulo_numeroInscricao: titulo_numeroInscricao,
                        titulo_zona: titulo_zona,
                        titulo_uf: titulo_uf,
                        titulo_municipio: titulo_municipio,
                        titulo_dataEmissao: titulo_dataEmissao,
                    }).transacting(transaction);

            await database('funcionario_ctps')
                    .insert({
                        ctps_numero: ctps_numero,
                        ctps_serie: ctps_serie,
                        ctps_uf: ctps_uf,
                    }).transacting(transaction);

            await database('funcionario_reservista')
                    .insert({
                        reservista_ra: reservista_ra,
                    }).transacting(transaction);

            await database('funcionario_banco')
                    .insert({
                        banco_agencia: banco_agencia,
                        banco_tipoConta: banco_tipoConta,
                        banco_numeroConta: banco_numeroConta,
                    }).transacting(transaction);

        }).then(() => { response.redirect('/funcionarios'); });
    } catch (err) {
        response.redirect('/funcionario/new');
        console.log(err);
    }
});

router.get('/data/:funcionario_id', adminAuth, async (request, response) => {
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

router.post('/funcionario/delete/:funcionario_id', adminAuth, async (request, response) => {
    var funcionario_id = request.params.funcionario_id;

    if (request.session.user.usuario == 'adm') {
        try {
            await database.transaction(async transaction => {

                await database('funcionarios')
                        .where('funcionario_id', funcionario_id)        
                            .delete()
                                .transacting(transaction);
    
                await database('funcionario_endereco')
                        .where('endereco_id', funcionario_id)        
                            .delete()
                                .transacting(transaction);
    
                await database('funcionario_rg')
                        .where('rg_id', funcionario_id)        
                            .delete()
                                .transacting(transaction);
    
                await database('funcionario_cpf')
                        .where('cpf_id', funcionario_id)        
                            .delete()
                                .transacting(transaction);
    
                await database('funcionario_sus')
                        .where('sus_id', funcionario_id)        
                            .delete()
                                .transacting(transaction);
    
                await database('funcionario_tituloEleitor')
                        .where('titulo_id', funcionario_id)        
                            .delete()
                                .transacting(transaction);
    
                await database('funcionario_ctps')
                        .where('ctps_id', funcionario_id)        
                            .delete()
                                .transacting(transaction);

                await database('funcionario_reservista')
                        .where('reservista_id', funcionario_id)        
                            .delete()
                                .transacting(transaction);
    
                await database('funcionario_banco')
                        .where('banco_id', funcionario_id)        
                            .delete()
                                .transacting(transaction);
    
            }).then(() => { response.redirect('/funcionarios') });
        } catch (err) {
            response.redirect('/funcionarios');
            console.log(err);
        }
    } else {
        response.redirect('/funcionarios');
    }
});

router.get('/funcionario/edit/:funcionario_id', adminAuth, async (request, response) => {
    var funcionario_id = request.params.funcionario_id;

    if (isNaN(funcionario_id)) {
        response.redirect('/funcionarios');
    }

    await database('funcionarios')
            .innerJoin('funcionario_endereco', 'funcionario_endereco.endereco_id', '=', 'funcionarios.funcionario_id')
            .innerJoin('funcionario_rg', 'funcionario_rg.rg_id', '=', 'funcionarios.funcionario_id')
            .innerJoin('funcionario_cpf', 'funcionario_cpf.cpf_id', '=', 'funcionarios.funcionario_id')
            .innerJoin('funcionario_sus', 'funcionario_sus.sus_id', '=', 'funcionarios.funcionario_id')
            .innerJoin('funcionario_tituloEleitor', 'funcionario_tituloEleitor.titulo_id', '=', 'funcionarios.funcionario_id')
            .innerJoin('funcionario_ctps', 'funcionario_ctps.ctps_id', '=', 'funcionarios.funcionario_id')
            .innerJoin('funcionario_reservista', 'funcionario_reservista.reservista_id', 'funcionarios.funcionario_id')
            .innerJoin('funcionario_banco', 'funcionario_banco.banco_id', '=', 'funcionarios.funcionario_id')
                .where('funcionario_id', funcionario_id)
                    .first()
                        .then((data) => {
                            database('departamento_funcoes')
                                .select('*')
                                    .then((funcoes) => {
                                        response.render('funcionarios/edit', {
                                            data: data,
                                            funcoes: funcoes
                                        });
                                    });
                        }).catch(() => {
                            response.redirect('/funcionarios');
                        });
});

router.post('/funcionario/update', adminAuth, async (request, response) => {
    var funcionario_id = request.body.funcionario_id;
    var funcionario_nomeCompleto = request.body.funcionario_nomeCompleto;
    var funcionario_funcao = request.body.funcionario_funcao;
    var funcionario_dataAdmissao = request.body.funcionario_dataAdmissao;
    var funcionario_salario = request.body.funcionario_salario;
    var funcionario_sexo = request.body.funcionario_sexo;
    var funcionario_email = request.body.funcionario_email;
    var funcionario_telefone = request.body.funcionario_telefone;
    
    var endereco_id = request.body.endereco_id;
    var endereco_cep = request.body.endereco_cep;
    var endereco_bairro = request.body.endereco_bairro;
    var endereco_rua = request.body.endereco_rua;
    var endereco_numero = request.body.endereco_numero;

    var rg_id = request.body.rg_id;
    var rg_numero = request.body.rg_numero;
    var rg_orgaoExpedidor = request.body.rg_orgaoExpedidor;
    var rg_dataExpedicao = request.body.rg_dataExpedicao;
    var rg_naturalidade = request.body.rg_naturalidade;
    var rg_dataNascimento = request.body.rg_dataNascimento;
    var rg_filiacao = request.body.rg_filiacao;

    var cpf_id = request.body.cpf_id;
    var cpf_numero = request.body.cpf_numero;

    var sus_id = request.body.sus_id;
    var sus_numero = request.body.sus_numero;

    var titulo_id = request.body.titulo_id;
    var titulo_numeroInscricao = request.body.titulo_numeroInscricao;
    var titulo_zona = request.body.titulo_zona;
    var titulo_uf = request.body.titulo_uf;
    var titulo_municipio = request.body.titulo_municipio;
    var titulo_dataEmissao = request.body.titulo_dataEmissao;

    var ctps_id = request.body.ctps_id;
    var ctps_numero = request.body.ctps_numero;
    var ctps_serie = request.body.ctps_serie;
    var ctps_uf = request.body.ctps_uf;

    var reservista_id = request.body.reservista_id;
    var reservista_ra = request.body.reservista_ra;

    var banco_id = request.body.banco_id;
    var banco_agencia = request.body.banco_agencia;
    var banco_tipoConta = request.body.banco_tipoConta;
    var banco_numeroConta = request.body.banco_numeroConta;

    try {
        await database.transaction(async transaction => {

            await database('funcionarios')
                    .where('funcionario_id', funcionario_id)
                        .update({
                            funcionario_nomeCompleto: funcionario_nomeCompleto,
                            funcionario_funcao: funcionario_funcao,
                            funcionario_dataAdmissao: funcionario_dataAdmissao,
                            funcionario_salario: funcionario_salario,
                            funcionario_sexo: funcionario_sexo,
                            funcionario_email: funcionario_email,
                            funcionario_telefone: funcionario_telefone,
                        }).transacting(transaction);

            await database('funcionario_endereco')
                    .where('endereco_id', endereco_id)
                        .update({
                            endereco_cep: endereco_cep,
                            endereco_bairro: endereco_bairro,
                            endereco_rua: endereco_rua,
                            endereco_numero: endereco_numero,
                        }).transacting(transaction);

            await database('funcionario_rg')
                    .where('rg_id', rg_id)
                        .update({
                            rg_numero: rg_numero,
                            rg_orgaoExpedidor: rg_orgaoExpedidor,
                            rg_dataExpedicao: rg_dataExpedicao,
                            rg_naturalidade: rg_naturalidade,
                            rg_dataNascimento: rg_dataNascimento,
                            rg_filiacao: rg_filiacao,
                        }).transacting(transaction);

            await database('funcionario_cpf')
                    .where('cpf_id', cpf_id)
                        .update({
                            cpf_numero: cpf_numero,
                        }).transacting(transaction);

            await database('funcionario_sus')
                    .where('sus_id', sus_id)
                        .update({
                            sus_numero: sus_numero,
                        }).transacting(transaction);

            await database('funcionario_tituloEleitor')
                    .where('titulo_id', titulo_id)
                        .update({
                            titulo_numeroInscricao: titulo_numeroInscricao,
                            titulo_zona: titulo_zona,
                            titulo_uf: titulo_uf,
                            titulo_municipio: titulo_municipio,
                            titulo_dataEmissao: titulo_dataEmissao,
                        }).transacting(transaction);

            await database('funcionario_ctps')
                    .where('ctps_id', ctps_id)
                        .update({
                            ctps_numero: ctps_numero,
                            ctps_serie: ctps_serie,
                            ctps_uf: ctps_uf,
                        }).transacting(transaction);

            await database('funcionario_reservista')
                    .where('reservista_id', reservista_id)
                        .update({
                            reservista_ra: reservista_ra,
                        }).transacting(transaction);

            await database('funcionario_banco')
                    .where('banco_id', banco_id)
                        .update({
                            banco_agencia: banco_agencia,
                            banco_tipoConta: banco_tipoConta,
                            banco_numeroConta: banco_numeroConta,
                        }).transacting(transaction);

        }).then(() => { response.redirect(`/data/${funcionario_id}`); });
    } catch (err) {
        response.redirect(`/funcionario/edit/${funcionario_id}`);
        console.log(err);
    }
});

module.exports = router;
