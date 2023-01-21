const { v4: uuidv4 } = require('uuid');
const { contas } = require("../db/bancodedados");


const listarContasBancarias = (req, res) => {
    const { senha_banco } = req.query

    try {
        if (!senha_banco || senha_banco !== 'Cubos123Bank') {
            return res.status(400).json({
                "mensagem": "A senha do banco informada é inválida!"
            })
        }

        return res.status(200).json(contas)
    } catch (error) {
        return res.status(500).json({ "mensagem": "Erro no servidor!" })
    }

}

const criarContaBancaria = (req, res) => {
    let id = uuidv4()

    try {
        let contaNova = {
            "numero": id,
            "saldo": 0,
            "usuario": { ...req.body }
        }

        contas.push(contaNova)

        return res.status(201).json()
    } catch (error) {
        return res.status(500).json({ "mensagem": "Erro no servidor!" })
    }
}

const atualizarUsuario = (req, res) => {
    const { numeroConta } = req.params

    try {

        let atualizandoConta = contas.find((conta) => {
            return conta.numero === numeroConta
        })

        atualizandoConta.usuario = { ...req.body }

        return res.status(204).json()

    } catch (error) {
        return res.status(500).json({ "mensagem": "Erro no servidor!" })
    }
}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params

    try {
        let i = contas.findIndex((conta) => {
            return conta.numero === numeroConta
        })

        contas.splice(i, 1)

        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({ "mensagem": "Erro no servidor!" })
    }
}

module.exports = {
    listarContasBancarias,
    criarContaBancaria,
    atualizarUsuario,
    excluirConta
}
