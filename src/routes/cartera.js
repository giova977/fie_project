const express = require('express');
const moment = require('moment')
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require("../lib/auth")

router.get('/add', isLoggedIn, async (req, res) => {
    res.render('cartera/add')
})

router.post('/add', isLoggedIn, async (req, res) => {
    const {
        selectTipoCartera, // MANDATORY
        selectTipoTasa, // MANDATORY
        selectTipoMoneda, // MANDATORY
        inpFechaEmision, // MANDATORY
        inpPlazoDias, // MANDATORY
        selectTipoPlazoTasa, // MANDATORY
        inpValorTasa, // MANDATORY
        selectPeriodoCapitalizacion, // MANDATORY solo si es NOMINAL
        inpValorNominal, // MANDATORY
        inpRetencion,
        inpCGI,
        inpCGF
    } = req.body

    var periodoCap = selectPeriodoCapitalizacion

    if (selectTipoCartera === "" || selectTipoCartera === "" || selectTipoMoneda === "" ||
    inpFechaEmision === "" || inpPlazoDias === "" || selectTipoPlazoTasa === "" || 
    inpValorTasa === "" || inpValorNominal === "") {
        return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
    } else {

        var temp = moment(inpFechaEmision).add(inpPlazoDias, 'days').calendar() /* MM/DD/YYYY */
        const [month, day, year] = temp.split('/')
        const strfechaPago = year.concat("-").concat(month).concat("-").concat(day)

        var tipoPlazaDias = 0
        if (selectTipoPlazoTasa === 'ANUAL') tipoPlazaDias = 360
        else if (selectTipoPlazoTasa === 'SEMESTRAL') tipoPlazaDias = 180
        else if (selectTipoPlazoTasa === 'CUATRIMESTRAL') tipoPlazaDias = 120
        else if (selectTipoPlazoTasa === 'TRIMESTRAL') tipoPlazaDias = 90
        else if (selectTipoPlazoTasa === 'BIMESTRAL') tipoPlazaDias = 60
        else if (selectTipoPlazoTasa === 'MENSUAL') tipoPlazaDias = 30
        else if (selectTipoPlazoTasa === 'QUINCENAL') tipoPlazaDias = 15
        else if (selectTipoPlazoTasa === 'DIARIO') tipoPlazaDias = 1

        var tipoPeriodoCap = 0
        var tasaEfectivaDias, tasaDescontadaDias, descuento, valorNeto, valorRecibido, valorEntregado, TCEA
        var valorNominal = Number(inpValorNominal)
        var CGF = Number(inpCGF)
        var CGI = Number(inpCGI)
        var retencion = Number(inpRetencion)
        var valorTasa = Number(inpValorTasa)

        if (selectTipoTasa === "NOMINAL" && selectPeriodoCapitalizacion === "") {
            console.log("Si el tipo de tasa es nominal es necesario que exista el periodo de capitalizacion")
        } else if (selectTipoTasa === "EFECTIVA") {
            tasaEfectivaDias = (Math.pow(1+(valorTasa/100), (inpPlazoDias/tipoPlazaDias)) - 1)
            tasaDescontadaDias = (tasaEfectivaDias) / (1 + tasaEfectivaDias)
            descuento = inpValorNominal * tasaDescontadaDias // Se va a la base de datos
            valorNeto = inpValorNominal - descuento // Se va a la base de datos
            valorRecibido = valorNeto - CGI - retencion // Se va a la base de datos
            valorEntregado = valorNominal + CGF - retencion // Se va a la base de datos
            periodoCap = undefined
        } else if (selectTipoTasa === "NOMINAL") {

            if (selectPeriodoCapitalizacion === 'ANUAL') tipoPeriodoCap = 360
            else if (selectPeriodoCapitalizacion === 'SEMESTRAL') tipoPeriodoCap = 180
            else if (selectPeriodoCapitalizacion === 'CUATRIMESTRAL') tipoPeriodoCap = 120
            else if (selectPeriodoCapitalizacion === 'TRIMESTRAL') tipoPeriodoCap = 90
            else if (selectPeriodoCapitalizacion === 'BIMESTRAL') tipoPeriodoCap = 60
            else if (selectPeriodoCapitalizacion === 'MENSUAL') tipoPeriodoCap = 30
            else if (selectPeriodoCapitalizacion === 'QUINCENAL') tipoPeriodoCap = 15
            else if (selectPeriodoCapitalizacion === 'DIARIO') tipoPeriodoCap = 1

            var m = tipoPlazaDias / tipoPeriodoCap
            var n = 360 / tipoPeriodoCap

            var TEA = (Math.pow(1+((valorTasa/100)/m), n)) - 1

            tasaEfectivaDias = Math.pow((1+TEA), (inpPlazoDias/360)) - 1
            tasaDescontadaDias = (tasaEfectivaDias) / (1 + tasaEfectivaDias)

            descuento = inpValorNominal * tasaDescontadaDias // Se va a la base de datos
            valorNeto = inpValorNominal - descuento // Se va a la base de datos
            valorRecibido = valorNeto - CGI - retencion // Se va a la base de datos
            valorEntregado = valorNominal + CGF - retencion // Se va a la base de datos
        }

        TCEA = (Math.pow((valorEntregado/valorRecibido), (360/inpPlazoDias)) - 1) * 100

        valorTasa = valorTasa.toFixed(6)
        valorNominal = valorNominal.toFixed(2)
        CGI = CGI.toFixed(2)
        CGF = CGF.toFixed(2)
        retencion = retencion.toFixed(2)
        descuento = descuento.toFixed(2)
        valorNeto = valorNeto.toFixed(2)
        valorRecibido = valorRecibido.toFixed(2)
        valorEntregado = valorEntregado.toFixed(2)
        TCEA = TCEA.toFixed(6)

        var TipoCartera = selectTipoCartera
        var TipoTasa = selectTipoTasa
        var TipoMoneda = selectTipoMoneda
        var FechaEmision = inpFechaEmision
        var FechaPago =  strfechaPago
        var PlazoDias = inpPlazoDias
        var TipoPlazoTasa = selectTipoPlazoTasa
        var ValorTasa = valorTasa
        var PeriodoCapitalizacion = periodoCap
        var ValorNominal = valorNominal
        var CostoInicialTotal = CGI
        var CostoFinalTotal = CGF
        var Retencion = retencion
        var Descuento = descuento
        var ValorNeto = valorNeto
        var ValorRecibido = valorRecibido
        var ValorEntregado = valorEntregado

        const carteraNueva = {
            IDCliente: req.user.ID,
            TipoCartera,
            TipoTasa,
            TipoMoneda,
            FechaEmision,
            FechaPago,
            PlazoDias,
            TipoPlazoTasa,
            ValorTasa,
            PeriodoCapitalizacion,
            ValorNominal,
            CostoInicialTotal,
            CostoFinalTotal,
            Retencion,
            Descuento,
            ValorNeto,
            ValorRecibido,
            ValorEntregado,
            TCEA
        }

        try {
            await pool.query('INSERT INTO Cartera set ?', [carteraNueva])
            req.flash('success', 'Cartera agregada correctamente')
            res.redirect("/cartera/")
        } catch (error) {
            res.status(500);
            res.send(error.message);
        }
    }

})

router.get('/', isLoggedIn, async (req, res) => {
    const carteras = await pool.query("SELECT * FROM Cartera WHERE IDCliente = ?", [req.user.ID])
    res.render('cartera/list', {carteras: carteras})
})

router.get('/delete/:IDCartera', isLoggedIn, async (req, res) => {
    const { IDCartera } = req.params
    await pool.query("DELETE FROM Cartera WHERE IDCartera = ?", [IDCartera])
    req.flash('success', 'Cartera removida')
    res.redirect("/cartera/")
})

module.exports = router;