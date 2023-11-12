class Teclado {
    shift = false;
    control = false;
    // alt = false;
    altgr = false;
    mayuscula = false
    texto = ""
    sizeFila = 45
    teclasPresionadas = new Set()
    espaciosTabulacion = 4

    constructor() {

        document.getElementById("teclado").addEventListener("click", function (e) {
            if (e.target.parentElement.className == "fila") {
                console.log(e.target.getAttribute("code"));
                this.teclear(e.target.getAttribute("code"))
            }
        }.bind(this))

        document.addEventListener("keydown", function (e) {
            e.preventDefault()
            if (e.code == "F5") {
                window.location.reload();
            }
            if (!this.teclasPresionadas.has(e.key)) {
                this.teclear(e.code)
                // Las teclas especiales que estan en [...] son las unicas que pueden repetir al mantener presionadas 
                if (this.esTeclaEspecial(e.code) && !(["Space", "Tab", "Enter"].includes(e.code))) {
                    this.teclasPresionadas.add(e.key)
                }
            }
        }.bind(this))

        document.addEventListener("keyup", function (e) {
            this.teclasPresionadas.delete(e.key)
            e.preventDefault()
            if (e.code == "CapsLock") {
                return
            }
            //hace que esas teclas al levantarse no se ejecuten, ya que se ejecuta en keydown
            if (this.esTeclaEspecial(e.code) && !(["Space", "Tab", "Enter", "MetaLeft", "MetaRight"].includes(e.code))) {
                this.ejecutarTeclaEspecial(e.code)
            }
        }.bind(this))

        this.actualizar()
    }

    teclear(texto) {
        if (texto == "Backspace") {
            this.borrar()
            return
        }
        else if (this.esTeclaEspecial(texto)) {
            this.ejecutarTeclaEspecial(texto)
        }
        else if (this.esTeclaCaracter(texto)) {
            this.escribir(this.alterarCaracter(texto.slice(-1).toLowerCase()))
        }
        else if (this.esTeclaCaracterEspecial(texto)) {
            this.escribir(this.alterarCaracterEspecial(texto))
        }

        else if (this.esTeclaNumerica(texto)) {
            this.escribir(this.alterarNumero(texto.slice(-1).toLowerCase()))
        }
    }

    esNecesarioSaltoDeLinea() {
        let ultimaLinea = this.texto
        if (this.texto.includes("<br>")) {
            ultimaLinea = (this.texto.slice(this.texto.lastIndexOf("<br>")))
        }
        let size = ultimaLinea.replaceAll("&nbsp;", ".")
            .replaceAll("<br>", "")
            .replaceAll("&gt;", ".")
            .replaceAll("&lt;", ".")
            .length


        return size > this.sizeFila
    }

    borrar() {
        if (this.texto.endsWith("<br>")) {
            this.texto = this.texto.slice(0, this.texto.length - 4)
        } else if (this.texto.endsWith("&nbsp;")) {
            this.texto = this.texto.slice(0, this.texto.length - 6)
        } else if (this.texto.endsWith("&gt;") || this.texto.endsWith("&lt;")) {
            this.texto = this.texto.slice(0, this.texto.length - 4)
        }

        else {
            this.texto = this.texto.slice(0, this.texto.length - 1)
        }
        this.actualizar()
    }

    escribir(texto) {
        if (this.esNecesarioSaltoDeLinea()) {
            this.ejecutarTeclaEspecial("Enter")
        }
        this.texto += texto
        this.actualizar()
    }

    esTeclaEspecial(texto) {
        if (["Tab", "CapsLock", "ShiftLeft", "ControlLeft", "MetaLeft", "AltLeft", "Space", "AltRight", "MetaRight", "ControlRight", "ShiftRight", "Enter"].includes(texto)) {
            return true
        }
        return false
    }

    /**
     * 
     * @param {String} texto 
     * @returns {boolean}
     */
    esTeclaCaracter(texto) {
        return texto.startsWith("Key")
    }

    esTeclaNumerica(texto) {
        return texto.startsWith("Digit")
    }

    esTeclaCaracterEspecial(texto) {
        return ["Backquote", "IntlBackslash", "Comma", "Period", "Slash", "Semicolon", "Quote",
            "Backslash", "BracketLeft", "BracketRight", "Minus", "Equal"].includes(texto)
    }

    /**
     * 
     * @param {string} texto 
     * @returns {String}
     */
    alterarCaracter(texto) {
        let resultado = ""
        if (((this.shift && !this.mayuscula) || (!this.shift && this.mayuscula)) && !this.altgr /*&& !this.alt*/) {
            resultado = texto.toUpperCase()
        }
        else if (!this.shift && this.altgr /*&& !this.alt*/) {
            resultado = "æ”¢ð€đŋħ→ˀĸłµnøþ@¶ßŧ↓“ł»←«"[texto.toUpperCase().charCodeAt() - 65] || "&nbsp;"
        }
        else if ((!this.shift && !this.mayuscula) || (this.shift && this.mayuscula) && !this.altgr /*&& !this.alt*/) {
            resultado = texto
        }


        return resultado
    }

    //TODO: alterar caracter especial `+ḉ-.,
    alterarCaracterEspecial(texto) {
        let teclas = ["Backquote", "IntlBackslash", "Comma", "Period", "Slash", "Semicolon", "Quote",
            "Backslash", "BracketLeft", "BracketRight", "Minus", "Equal"]
        let resultado = ""

        if (["Semicolon", "Backslash"].includes(texto)) {
            if (!this.altgr) {
                return this.alterarCaracter(texto == "Semicolon" ? "ñ" : "ç")
            }
        }


        if (this.shift && !this.altgr) {
            if (texto == "IntlBackslash") {
                return "&gt;"
            }
            resultado = "ª>;:_Ñ¨Ç^*?¿"[teclas.indexOf(texto)]
        }
        else if (!this.shift && this.altgr) {
            resultado = "\\|─·-~{}[]\\~"[teclas.indexOf(texto)]
        }

        else if (!this.shift && !this.altgr) {
            if (texto == "IntlBackslash") {
                return "&lt;"
            }
            resultado = "º\<,.-ñ´ç`+'¡"[teclas.indexOf(texto)]
        }


        return resultado

    }
    alterarNumero(texto) {
        let resultado = ""
        if (this.shift && !this.altgr /*&& !this.alt*/) {
            resultado = `=!"·$%&/()`[Number(texto)]
        }
        else if (!this.shift && this.altgr /*&& !this.alt*/) {
            resultado = `}|@#~½¬{[]}`[Number(texto)]
        }


        else if (!this.shift && !this.altgr /*&& !this.alt*/) {
            resultado = texto
        }
        return resultado
    }

    ejecutarTeclaEspecial(texto) {
        switch (texto) {
            case "Tab":
                for (let index = 0; index < this.espaciosTabulacion; index++) {
                    this.escribir("&nbsp;")
                }
                break;

            case "CapsLock":
                this.mayuscula = !this.mayuscula
                break;

            case "ShiftRight":
            case "ShiftLeft":
                this.shift = !this.shift
                break;

            case "ControlRight":
            case "ControlLeft":
                this.control = !this.control
                break;

            case "MetaRight":
            case "MetaLeft":
                this.escribir("╬")
                break;

            // case "AltLeft":
            //     this.alt = !this.alt
            //     break;


            case "Space":
                this.escribir("&nbsp;")
                break;

            case "AltRight":
                this.altgr = !this.altgr
                break;

            case "fn":
                this.escribir("¡Funciona!")
                break;

            case "Enter":
                this.texto += "<br>"
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
            altgr=${this.altgr}<br>
            mayus=${this.mayuscula}`
        // + `<br>alt=${this.alt}`
        if (document.getElementById("visualizacionALternativaTecla").checked) {
            this.alterarTeclado()
        }
    }

    alterarTeclado() {
        [...document.getElementsByClassName("alternativa")].forEach(function (elemento) {
            if (this.esTeclaNumerica(elemento.getAttribute("code"))) {
                elemento.innerHTML = this.alterarNumero(elemento.getAttribute("code").slice(-1)) || "&nbsp;"
            }
            else if (this.esTeclaCaracterEspecial(elemento.getAttribute("code"))) {
                elemento.innerHTML = this.alterarCaracterEspecial(elemento.getAttribute("code")) || "&nbsp;"
            }
            else if (this.esTeclaCaracter(elemento.getAttribute("code"))) {
                elemento.innerHTML = this.alterarCaracter(elemento.getAttribute("code").slice(-1).toLowerCase()) || "&nbsp;"
            }
        }.bind(this))
    }
}


keyb = new Teclado();