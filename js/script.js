class Teclado {
    shift = false;
    control = false;
    alt = false;
    altgr = false;
    mayuscula = false
    texto = ""
    sizeFila = 103

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

        document.addEventListener("keyup", function (e) {
            e.preventDefault()
            this.ejecutarTeclaEspecial(e.key)
        }.bind(this))
    }

    teclear(texto) {
        if (texto == "Backspace") {
            this.borrar()
            return
        }
        if (this.esTeclaEspecial(texto)) {
            this.ejecutarTeclaEspecial(texto)
        }
        if (this.esNecesarioSaltoDeLinea()) {
            this.ejecutarTeclaEspecial("Enter")
        }
        if (this.esTeclaNormal(texto)) {
            this.escribir(texto.toLocaleLowerCase())
        }

    }

    esNecesarioSaltoDeLinea() {
        let necesidad = (this.texto.slice(this.texto.lastIndexOf("<br>")).replaceAll("&nbsp;", ".").replaceAll("<br>", "").length) > this.sizeFila
        if (this.texto.lastIndexOf("<br>") == -1) {
            return this.texto.replaceAll("&nbsp;", ".").length > this.sizeFila
        }
        return necesidad
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
        if (this.esNecesarioSaltoDeLinea()) {
            this.ejecutarTeclaEspecial("Enter")
        }
        this.actualizar()
    }

    esTeclaEspecial(texto) {
        if (["Tab", "CapsLock", "Shift", "Control", "Meta", "Alt", " ", " ", "AltGraph", "Enter"].includes(texto)) {
            return true
        }
        return false
    }
    esTeclaNormal(texto) {
        if (("abcdefghijklmnñopqrstuvwxyz123456789+-*/.,<>`" + '=!"·$%&/()'+"€").includes(texto.toLowerCase())) {
            return true
        }
        return false
    }

    //TODO: alterar texto en base a los atributos 
    /**
     * 
     * @param {string} texto 
     * @returns {String}
     */
    alterarTexto(texto) {
        if (this.shift) {
            console.log(texto)
            if (Number(texto)) {
                return ['=', '!', '"', '·', '$', '%', '&', '/', '(', ')'][Number(texto)]
            }

            if (texto.toUpperCase() == texto) {
                texto = texto.toLocaleLowerCase()
            } else {
                texto = texto.toUpperCase()
            }
        }
        if(this.altgr){
            console.log(texto)
            if(texto = "e"){
                return "€"
            }
        }

        return texto
    }

    ejecutarTeclaEspecial(texto) {
        switch (texto) {
            case "Tab":
                this.escribir("&nbsp;")
                this.escribir("&nbsp;")
                this.escribir("&nbsp;")
                this.escribir("&nbsp;")
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
        this.actualizar()

    }

    actualizar() {
        document.getElementById("textoPantalla").innerHTML = this.texto
        document.getElementById("debugInfo").innerHTML = `
            shift=${this.shift}<br>
            control=${this.control}<br>
            alt=${this.alt}<br>
            altgr=${this.altgr}<br>
            mayus=${this.mayuscula}
        `
    }
}


keyb = new Teclado();