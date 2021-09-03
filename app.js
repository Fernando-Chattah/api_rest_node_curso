//Para habilitarlo hay que hacer export DEBUG=app:inicio
const inicioDebug = require('debug')('app:inicio')
const express = require("express");
// Para validacion de datos
const Joi = require("joi");
const config = require("config");
const morgan = require("morgan");

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended : true }))

// Solo habilito el log si es ambiente de desarrollo
if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
    inicioDebug('Morgan esta habilitado')
}

console.log("Aplicacion: " + config.get('nombre'))
console.log("DB Server: " + config.get('configDB.host'))


const usuarios = [
    {id: 1, name: "Carlos"},
    {id: 2, name: "Steeb"},
    {id: 3, name: "Roldan"}
]

app.post('/api/usuarios', (req, res) => {

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

app.put('/api/usuario/:id', (req, res)=> {
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

app.delete('/api/usuario/:id', (req, res)=> {

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


app.get('/', (req, res)=> {
    res.send("Hola Mundo desde Express")
})

app.get('/api/usuarios', (req, res)=> {
    res.send(usuarios)
})

app.get('/api/usuario/:id', (req, res)=> {
    const usuario = findUser(req.params.id)
    if(!usuario) res.status(401).send("El usuario no fue encontrado")
    res.send(usuario);
})

app.get('/api/usuario/:id/:year', (req, res)=> {
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

const port = process.env.PORT || 3000;

app.listen(port, ()=> {
    console.log(`Server on port ${port}`)
})