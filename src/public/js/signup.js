document.getElementById("selectTipoPersona").addEventListener("change", () => {
    const val = document.getElementById("selectTipoPersona").value;
    
    if (val === "NATURAL") {
        document.getElementById("razonSocial").style.visibility = "hidden"   
        document.getElementById("razonSocial").style.display = "none"
        document.getElementById("tipoPersonaNaturalBlock").style.visibility = "visible"    
        document.getElementById("tipoPersonaNaturalBlock").style.display = "block"
        document.getElementById("nroDocumento").placeholder = "DNI"
        document.getElementById("nroDocumento").maxlength = "8"
    } else {
        document.getElementById("razonSocial").style.visibility = "visible"   
        document.getElementById("razonSocial").style.display = "block"
        document.getElementById("tipoPersonaNaturalBlock").style.visibility = "hidden"    
        document.getElementById("tipoPersonaNaturalBlock").style.display = "none"  
        document.getElementById("nroDocumento").placeholder = "RUC"  
        document.getElementById("nroDocumento").maxlength = "11"
    }
})