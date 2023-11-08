class Teclado {
    shift = false;
    control = false;
    alt = false;
    altgr = false;
    mayuscula = false
    texto = ""

    constructor() {

        document.getElementById("teclado").addEventListener("click", function (e) {
            if (e.target.parentElement.className == "fila") {
                this.teclear(e.target.innerText)
            }
        }.bind(this))

        document.addEventListener("keydown", function (e) {
            e.preventDefault()
            this.teclear(e.key)
        }.bind(this))
    }

    teclear(texto) {
        if (texto == "Backspace") {
            this.borrar()
            return
        } else if (this.esTeclaEspecial(texto)) {
            this.ejecutarTeclaEspecial(texto)
        } else if (this.esTeclaNormal(texto)) {
            this.escribir(texto)
        }


    }

    borrar() {
        if (this.texto.endsWith("<br>")) {
            this.texto = this.texto.slice(0, this.texto.length - 4)
        } else if (this.texto.endsWith("&nbsp;")) {
            this.texto = this.texto.slice(0, this.texto.length - 6)
        } else {
            this.texto = this.texto.slice(0, this.texto.length - 1)
        }
        this.actualizar()
    }

    escribir(texto) {
        this.texto += this.alterarTexto(texto)
        this.actualizar()
    }

    esTeclaEspecial(texto) {
        if (["Tab", "CapsLock", "Shift", "Control", "Meta", "Alt", " ", " ", "AltGraph", "Enter"].includes(texto)) {
            return true
        }
        return false
    }
    esTeclaNormal(texto) {
        if ("abcdefghijklmnñopqrstuvwxyz123456789+-*/.,<>`".includes(texto.toLowerCase())) {
            return true
        }
        return false
    }

    //TODO: alterar texto en base a los atributos 
    alterarTexto(texto) {
        return texto
    }

    ejecutarTeclaEspecial(texto) {
        switch (texto) {
            case "Tab":
                this.escribir("&nbsp;&nbsp;&nbsp;&nbsp;")
                break;

            case "CapsLock":
                this.mayuscula = !this.mayuscula
                break;

            case "Shift":
                this.shift = !this.shift
                break;

            case "Control":
                this.control = !this.control
                break;

            case "Meta":
                this.escribir("ventana")
                break;

            case "Alt":
                this.alt = !this.alt
                break;

            case " ":
            case " ":
                this.escribir("&nbsp;")
                break;

            case "AltGraph":
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

    actualizar() {
        document.getElementById("textoPantalla").innerHTML = this.texto
    }
}


keyb = new Teclado();