const express = require('express')
const router = express.Router();

// Para validacion de datos
const Joi = require("joi");

const usuarios = [
    {id: 1, name: "Carlos"},
    {id: 2, name: "Steeb"},
    {id: 3, name: "Roldan"}
]

router.post('/', (req, res) => {

    const {error, value} = validarUser(req.body.name);

    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            name: value.name
        }
        usuarios.push(usuario);
        res.send(usuario);
    } else {
        res.status(400).send(error.details[0].message)
    }
})

router.put('/:id', (req, res)=> {
    //Encontrar si existe el usuario

    const usuario = findUser(req.params.id)
    if(!usuario) res.status(401).send("El usuario no fue encontrado")
    const {error, value} = validarUser(req.body.name)

    if (error) {
        res.status(400).send(error.details[0].message)
    }    

    usuario.name = value.name
    res.send(usuario)
})

router.delete('/:id', (req, res)=> {

    const usuario = findUser(req.params.id)
    if(!usuario) res.status(401).send("El usuario no fue encontrado")
    const {error, value} = validarUser(req.body.name)

    if (error) {
        res.status(400).send(error.details[0].message)
    }    

    const index = usuarios.indexOf(usuario)
    usuarios.splice(index, 1)
    res.send(usuarios)
})

router.get('/', (req, res)=> {
    res.send(usuarios)
})

router.get('/:id', (req, res)=> {
    const usuario = findUser(req.params.id)
    if(!usuario) res.status(401).send("El usuario no fue encontrado")
    res.send(usuario);
})

router.get('/:id/:year', (req, res)=> {
    res.send(req.params)
    res.send(req.params.id)
})

const findUser = (id) => {
    return usuarios.find(u => u.id === parseInt(id))
}

const validarUser = (nombre) => {

    const schema = Joi.object({
        name: Joi.string()
            .alphanum()
            .min(3)
            .required()
    })

    return schema.validate({ name: nombre });
}

module.exports = router;