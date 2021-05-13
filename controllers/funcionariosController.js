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
    var reservista_localNascimento = request.body.reservista_localNascimento;
    var reservista_dataNascimento = request.body.reservista_dataNascimento;
    var reservista_filiacaoMae = request.body.reservista_filiacaoMae;
    var reservista_filiacaoPai = request.body.reservista_filiacaoPai;

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
                    reservista_localNascimento: reservista_localNascimento,
                    reservista_dataNascimento: reservista_dataNascimento,
                    reservista_filiacaoMae: reservista_filiacaoMae,
                    reservista_filiacaoPai: reservista_filiacaoPai,
                }).transacting(transaction);

            await database('funcionario_banco')
                    .insert({
                        banco_agencia: banco_agencia,
                        banco_tipoConta: banco_tipoConta,
                        banco_numeroConta: banco_numeroConta,
                    }).transacting(transaction);
        
            response.redirect('/funcionarios');
        });
    } catch (err) {
        response.redirect('/funcionario/new');
        console.log(err);
    }
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

    await database('funcionarios')
            .where('funcionario_id', funcionario_id)
                .first()
                    .then((funcionario) => {
                        database('departamento_funcoes')
                            .select('*')
                                .then((funcoes) => {
                                    response.render('funcionarios/edit', {
                                        funcionario: funcionario,
                                        funcoes: funcoes,
                                    });
                                });
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

    await database('funcionarios')
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

module.exports = router;
