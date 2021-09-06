//Para habilitarlo hay que hacer export DEBUG=app:inicio
const inicioDebug = require('debug')('app:inicio')
const express = require("express");

const usuarios = require('./routes/usuarios')

const config = require("config");
const morgan = require("morgan");

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use('/api/usuario', usuarios)

// Solo habilito el log si es ambiente de desarrollo
if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
    inicioDebug('Morgan esta habilitado')
}

console.log("Aplicacion: " + config.get('nombre'))
console.log("DB Server: " + config.get('configDB.host'))

const port = process.env.PORT || 3000;

app.listen(port, ()=> {
    console.log(`Server on port ${port}`)
})