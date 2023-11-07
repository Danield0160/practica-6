class Teclado{
    shift = false;
    control = false;
    alt = false;
    altgr = false;
    mayuscula= false
    texto = ""

    constructor(){

        document.getElementById("teclado").addEventListener("click",function(e){
            if(e.target.parentElement.className == "fila"){
                this.teclear(e.target.innerText)
            }
        }.bind(this))

        document.addEventListener("keydown", function(event) {
            event.preventDefault()
            console.log(`Key pressed: ${event.key}`);
        })
    }

    teclear(texto){
        if(texto =="Backspace"){
            this.borrar()
            return
        }else if(this.esTeclaEspecial(texto)){
            this.ejecutarTeclaEspecial(texto)
        }else{
            this.escribir(texto)
        }
        
        
    }

    borrar(){
        if(this.texto.endsWith("<br>")){
            this.texto = this.texto.slice(0,this.texto.length-4)
        }else if(this.texto.endsWith("&nbsp;")){
            this.texto = this.texto.slice(0,this.texto.length-6)
        }else{
            this.texto = this.texto.slice(0,this.texto.length-1)
        }
        this.actualizar()
    }

    escribir(texto){
        this.texto += this.alterarTexto(texto)
        this.actualizar()
    }

    esTeclaEspecial(texto){
        if(["Tab","Caps Lock","shift","control","windows","alt","space","alt gr","fn","Enter"].includes(texto)){
            return true
        }
        return false
    }

    alterarTexto(texto){




        return texto
    }

    ejecutarTeclaEspecial(texto) {
        switch (texto) {
            case "Tab":
                this.escribir("&nbsp;&nbsp;&nbsp;&nbsp;")
                break;

            case "Caps Lock":
                this.mayuscula = !this.mayuscula
                break;

            case "shift":
                this.shift = !this.shift
                break;

            case "control":
                this.control = !this.control
                break;

            case "windows":
                this.escribir("ventana")
                break;

            case "alt":
                this.alt = !this.alt
                break;

            case "space":
                this.escribir("&nbsp;")
                break;

            case "alt gr":
                this.altgr = !this.altgr
                break;

            case "fn":
                this.escribir("¡Funciona!")
                break;

            case "Enter":
                this.escribir("<br>")
                break;

            default:
                break;
        }

    }

    actualizar(){
        document.getElementById("textoPantalla").innerHTML = this.texto
    }
}


keyb =new Teclado();