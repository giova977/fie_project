const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

const pool = require('../database');
const helpers = require("../lib/helpers")

passport.use('local.signin', new LocalStrategy({
    usernameField: 'NroDocumento',
    passwordField: 'Contraseña',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log(req.body)
    const rows = await pool.query('SELECT * FROM Cliente WHERE NroDocumento = ?', [username])
    if (rows.length > 0) {
        const cliente = rows[0]
        const validPassword = await helpers.matchPassword(password, cliente.Contraseña)
        if (validPassword) {
            done(null, cliente)
        } else {
            done(null, false, req.flash('message', "Contraseña incorrecta"))
        }
    } else {
        return done(null, false, req.flash('message', "El cliente no existe"))
    }
}))

passport.use('local.signup', new LocalStrategy({
    usernameField: 'NroDocumento',
    passwordField: 'Contraseña',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { selectTipoPersona, RazonSocial, Nombres, ApellidoPaterno, ApellidoMaterno } = req.body
    
    var tamNroDoc = username.length

    if ((selectTipoPersona === "NATURAL" && tamNroDoc === 8 && (RazonSocial === "")) || (selectTipoPersona === "JURIDICA" && tamNroDoc === 11 && (Nombres === "" || ApellidoPaterno === "" || ApellidoMaterno === ""))) {

        var TipoPersona = selectTipoPersona
        var NroDocumento = username
        var Contraseña = password
        const clienteNuevo = {
            TipoPersona,
            RazonSocial,
            Nombres,
            ApellidoPaterno,
            ApellidoMaterno,
            NroDocumento,
            Contraseña,
        }
        clienteNuevo.Contraseña = await helpers.encryptPassword(password)
        const rows = await pool.query("SELECT * FROM Cliente WHERE NroDocumento = ?", [clienteNuevo.NroDocumento])
        if (rows.length === 0) {
            const result = await pool.query('INSERT INTO Cliente SET ?', [clienteNuevo])
            clienteNuevo.ID = result.insertId
            return done(null, clienteNuevo)            
        } else {
            return done(null, false)
        }
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.ID)
})

passport.deserializeUser( async (id, done) => {
    const rows = await pool.query("SELECT * FROM Cliente WHERE ID = ?", [id])
    if (rows.length === 0) {
        done(null, false)
    } else {
        done(null, rows[0])
    }
})