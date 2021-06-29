document.getElementById("selectTipoTasa").addEventListener("change", () => {
    const val = document.getElementById("selectTipoTasa").value;
    
    if (val === "EFECTIVA") {
        document.getElementById("divPeriodoCap").style.visibility = "hidden"   
        document.getElementById("divPeriodoCap").style.display = "none"
        document.getElementById("selectPeriodoCapitalizacion").value = ""
    } else {
        document.getElementById("divPeriodoCap").style.visibility = "visible"    
        document.getElementById("divPeriodoCap").style.display = "block"
    }
})