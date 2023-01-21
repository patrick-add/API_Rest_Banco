const operacao = require("../db/bancodedados");

// Metodos para verificação
const verificarSeContaExiste = (numeroConta) => {
    let contaExistente = operacao.contas.find((contaAtual) => {
        return contaAtual.numero === numeroConta
    })

    return contaExistente
}

// Metodos principais
const verificacaoParaDepositar = (req, res, next) => {
    const { numero_conta, valor } = req.body

    if (valor <= 0) {
        return res.status(400).json({
            "mensagem": "O valor não pode ser igual ou menor que zero!"
        })
    }
    if (!numero_conta || !valor) {
        return res.status(400).json({
            "mensagem": "O número da conta e o valor são obrigatórios!"
        })
    }

    let conta = verificarSeContaExiste(numero_conta)

    if (!conta) {
        return res.status(404).json({
            "mensagem": "Conta bancária não encontada!"
        })
    }

    next()
}

const verificacaoParaSacar = (req, res, next) => {
    const { numero_conta, valor, senha } = req.body

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({
            "mensagem": "O número da conta, senha e o valor são obrigatórios!"
        })
    }
    if (valor < 0) {
        return res.status(400).json({
            "mensagem": "O valor não pode ser menor que zero!"
        })
    }
    let conta = verificarSeContaExiste(numero_conta)

    if (!conta) {
        return res.status(404).json({
            "mensagem": "Conta bancária não encontada!"
        })
    }

    if (conta.usuario.senha !== senha) {
        return res.status(401).json({
            "mensagem": "Senha Incorreta!"
        })
    }

    if (conta.saldo < valor) {
        return res.status(400).json({
            "mensagem": "Saldo insuficiente!"
        })
    }

    next()
}
const verificacaoParaTransferir = (req, res, next) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({
            "mensagem": "O número das contas de origem, destino, senha e o valor são obrigatórios!"
        })
    }
    if (valor < 0) {
        return res.status(400).json({
            "mensagem": "O valor não pode ser menor que zero!"
        })
    }

    let contaOrigem = verificarSeContaExiste(numero_conta_origem)
    let contaDestino = verificarSeContaExiste(numero_conta_destino)

    if (!contaOrigem) {
        return res.status(404).json({
            "mensagem": "O número da conta de origem não existe!"
        })
    }
    if (!contaDestino) {
        return res.status(404).json({
            "mensagem": "O número da conta de destino não existe!"
        })
    }

    if (contaOrigem.usuario.senha !== senha) {
        return res.status(401).json({
            "mensagem": "Senha Incorreta!"
        })
    }

    if (contaOrigem.saldo < valor) {
        return res.status(400).json({
            "mensagem": "Saldo insuficiente!"
        })
    }

    next()
}
const verificacaoParaSaldo = (req, res, next) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta || !senha) {
        return res.status(400).json({
            "mensagem": "O número da conta e a senha são obrigatórios!"
        })
    }
    let conta = verificarSeContaExiste(numero_conta)

    if (!conta) {
        return res.status(404).json({
            "mensagem": "Conta bancária não encontada!"
        })
    }

    if (conta.usuario.senha !== senha) {
        return res.status(401).json({
            "mensagem": "Senha Incorreta!"
        })
    }

    next()
}
const verificacaoParaExtrato = (req, res, next) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta || !senha) {
        return res.status(400).json({
            "mensagem": "O número da conta e a senha são obrigatórios!"
        })
    }
    let conta = verificarSeContaExiste(numero_conta)

    if (!conta) {
        return res.status(404).json({
            "mensagem": "Conta bancária não encontada!"
        })
    }

    if (conta.usuario.senha !== senha) {
        return res.status(401).json({
            "mensagem": "Senha Incorreta!"
        })
    }

    next()
}

module.exports = {
    verificacaoParaDepositar,
    verificacaoParaSacar,
    verificacaoParaTransferir,
    verificacaoParaSaldo,
    verificacaoParaExtrato
}