const operacao = require("../db/bancodedados");
const { format } = require("date-fns");

// Metodos para verificação
const verificarSeContaExiste = (numeroConta) => {
    let contaExistente = operacao.contas.find((contaAtual) => {
        return contaAtual.numero === numeroConta
    })

    return contaExistente
}

// Metodos principais
const depositar = (req, res) => {
    const { numero_conta, valor } = req.body

    try {
        let conta = verificarSeContaExiste(numero_conta)

        conta.saldo += valor

        operacao.depositos.push({
            "data": format(new Date(), "yyyy-MM-dd HH:mm:ss"),
            "numero_conta": numero_conta,
            "valor": valor
        })

        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({ "mensagem": "Erro no servidor!" })
    }
}

const sacar = (req, res) => {
    const { numero_conta, valor } = req.body

    try {
        let conta = verificarSeContaExiste(numero_conta)

        conta.saldo -= valor

        operacao.saques.push({
            "data": format(new Date(), "yyyy-MM-dd HH:mm:ss"),
            "numero_conta": numero_conta,
            "valor": valor
        })

        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({ "mensagem": "Erro no servidor!" })
    }
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor } = req.body

    try {
        let contaOrigem = verificarSeContaExiste(numero_conta_origem)
        let contaDestino = verificarSeContaExiste(numero_conta_destino)

        contaOrigem.saldo -= valor
        contaDestino.saldo += valor

        operacao.transferencias.push({
            "data": format(new Date(), "yyyy-MM-dd HH:mm:ss"),
            "numero_conta_origem": numero_conta_origem,
            "numero_conta_destino": numero_conta_destino,
            "valor": valor
        })

        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({ "mensagem": "Erro no servidor!" })
    }
}

const saldo = (req, res) => {
    const { numero_conta } = req.query

    try {
        let conta = verificarSeContaExiste(numero_conta)

        return res.status(200).json({ "saldo": conta.saldo })
    } catch (error) {
        return res.status(500).json({ "mensagem": "Erro no servidor!" })
    }
}

const extrato = (req, res) => {
    const { numero_conta } = req.query

    try {
        let depositos = operacao.depositos.filter(deposito => {
            return deposito.numero_conta === numero_conta
        })
        let saques = operacao.saques.filter(saque => {
            return saque.numero_conta === numero_conta
        })
        let transferenciasEnviadas = operacao.transferencias.filter(transferencia => {
            return transferencia.numero_conta_origem === numero_conta
        })
        let transferenciasRecebidas = operacao.transferencias.filter(transferencia => {
            return transferencia.numero_conta_destino === numero_conta
        })

        return res.status(200).json({ depositos, saques, transferenciasEnviadas, transferenciasRecebidas })

    } catch (error) {
        return res.status(500).json({ "mensagem": "Erro no servidor!" })
    }
}

module.exports = {
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}