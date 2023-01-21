const { contas } = require("../db/bancodedados");

const verificacaoParaCadastrar = (req, res, next) => {
    const { nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha } = req.body

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ "mensagem": "Dados incompletos, preencha todas as informações!" })
    }
    const verificacaoCPF = contas.find((conta) => {
        return conta.usuario.cpf === cpf
    })

    const verificacaoEmail = contas.find((conta) => {
        return conta.usuario.email === email
    })

    if (verificacaoCPF) {
        return res.status(400).json({
            "mensagem": "O CPF informado já existe cadastrado!"
        })
    }

    if (verificacaoEmail) {
        return res.status(400).json({
            "mensagem": "O EMAIL informado já existe cadastrado!"
        })
    }

    next()

}
const verificacaoParaAtualizar = (req, res, next) => {
    const { nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha } = req.body
    const { numeroConta } = req.params

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ "mensagem": "Dados incompletos, preencha todas as informações!" })
    }
    const verificacaoCPF = contas.find((conta) => {
        return conta.usuario.cpf === cpf && conta.numero !== numeroConta
    })

    if (verificacaoCPF) {
        return res.status(400).json({
            "mensagem": "O CPF informado já existe cadastrado!"
        })
    }
    const verificacaoEmail = contas.find((conta) => {
        return conta.usuario.email === email && conta.numero !== numeroConta
    })

    if (verificacaoEmail) {
        return res.status(400).json({
            "mensagem": "O EMAIL informado já existe cadastrado!"
        })
    }

    let atualizandoConta = contas.find((conta) => {
        return conta.numero === numeroConta
    })

    if (!atualizandoConta) {
        return res.status(404).json({
            "mensagem": "O número da conta não existe!"
        })
    }

    next()

}

const verificacaoParaExcluir = (req, res, next) => {
    const { numeroConta } = req.params

    let i = contas.findIndex((conta) => {
        return conta.numero === numeroConta
    })

    if (i === -1) {
        return res.status(404).json({
            "mensagem": "O número da conta não existe!"
        })
    }

    if (contas[i].saldo > 0) {
        return res.status(400).json({
            "mensagem": "A conta só pode ser removida se o saldo for zero!"
        })
    }

    next()
}

module.exports = {
    verificacaoParaCadastrar,
    verificacaoParaAtualizar,
    verificacaoParaExcluir
}