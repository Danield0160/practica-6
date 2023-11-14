class Teclado {
    shift = false;
    control = false;
    // alt = false;
    altgr = false;
    mayuscula = false
    texto = ""
    tamanhoFila = 38 //cuantos caracteres puede tener una fila
    // el set de abajo son teclas especiales que han recibido un keydown, y que no se quiere que mientras esten presionadas ejecuten el keydown todo el rato    
    teclasPresionadas = new Set()
    espaciosTabulacion = 4
    numeroDeLineas = 12

    /**
     * Inicia la escucha de eventos de click y de teclado
     */
    constructor() {
        document.getElementById("teclado").addEventListener("mousedown", function (e) {
            if (e.target.parentElement.className == "fila" || e.target.parentElement.id == "enter") {
                console.log(e.target)
                this.teclear(e.target.getAttribute("code"))
            }
        }.bind(this))
        document.getElementById("teclado").addEventListener("mouseup", function (e) {
            if (e.target.parentElement.className == "fila") {
                // Las teclas especiales que estan en [...] son las unicas que al levantar el click no se ejecutan (Para crear teclas alternantes)
                if (this.esTeclaEspecial(e.target.getAttribute("code")) && !["ShiftRight", "CapsLock", "Enter", "AltLeft"].includes(e.target.getAttribute("code"))) {
                    this.teclear(e.target.getAttribute("code"))
                }
            }
        }.bind(this))

        document.addEventListener("keydown", function (e) {
            e.preventDefault()
            if (e.code.startsWith("F")) {
                return
            }
            document.querySelector(`[code="${e.code}"]`).classList.add("activado")

            if (!this.teclasPresionadas.has(e.code)) {
                this.teclear(e.code)
                // Las teclas especiales que estan en [...] son las unicas que pueden repetir al mantener presionadas 
                if (this.esTeclaEspecial(e.code) && !(["Space", "Tab", "Enter"].includes(e.code))) {
                    this.teclasPresionadas.add(e.code)
                }
            }
        }.bind(this))

        document.addEventListener("keyup", function (e) {
            e.preventDefault()
            if (e.code.startsWith("F")) {
                return
            }
            this.teclasPresionadas.delete(e.code)

            document.querySelector(`[code="${e.code}"]`).classList.remove("activado")

            if (["ShiftRight", "CapsLock"].includes(e.code)) {
                return
            }
            //hace que esas teclas al levantarse no se ejecuten, ya que se ejecuta en keydown
            if (this.esTeclaEspecial(e.code) && !(["Space", "Tab", "Enter", "MetaLeft", "MetaRight", "AltLeft"].includes(e.code))) {
                this.ejecutarTeclaEspecial(e.code)
            }
        }.bind(this))

        this.actualizar()
    }

    /**
     * recoge la entrada de la escucha y la redirige segun el e.code
     * @param {String} texto e.code 
     */
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

    /**
     * Calcula si es necesario un salto de linea en base los caracters de la ultima linea y el this.tamanhoFila
     * @returns {Boolean} True si es necesario un salto de linea
     */
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


        return size > this.tamanhoFila
    }

    /**
     * Borra el ultimo caracter
     */
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

    /**
     * Comprueba que se pueda escribir mas y agrega el texto a escribir al this.texto 
     * @param {String} texto texto a escribir
     */
    escribir(texto) {
        if (this.esNecesarioSaltoDeLinea() && texto != "<br>") {
            if ([...this.texto.matchAll("<br>")].length > this.numeroDeLineas - 1) {
                return
            }
            this.texto += "<br>"
        }
        if ([...this.texto.matchAll("<br>")].length > this.numeroDeLineas || ([...this.texto.matchAll("<br>")].length > this.numeroDeLineas - 1 && texto == "<br>")) {
            if (this.texto.endsWith("<br>") && [...this.texto.matchAll("<br>")].length > 13) {
                this.borrar()
            }
            if (texto == "<br>") {
                return
            }
        } else {
            this.texto += texto
        }
        this.actualizar()
    }

    /**
     * comprueba si es una tecla especial
     * @param {String} texto e.code
     * @returns {Boolean}
     */
    esTeclaEspecial(texto) {
        if (["Tab", "CapsLock", "ShiftLeft", "ControlLeft", "MetaLeft", "AltLeft", "Space", "AltRight", "MetaRight", "ControlRight", "ShiftRight", "Enter"].includes(texto)) {
            return true
        }
        return false
    }

    /**
     * comprueba si es una tecla normal
     * @param {String} texto e.code
     * @returns {Boolean}
     */
    esTeclaCaracter(texto) {
        return texto.startsWith("Key")
    }

    /**
     * comprueba si es una tecla numercia
     * @param {String} texto e.code
     * @returns {Boolean}
     */
    esTeclaNumerica(texto) {
        return texto.startsWith("Digit")
    }

    /**
     * comprueba si es una tecla de caracteres especiales
     * @param {String} texto e.code
     * @returns {Boolean}
     */
    esTeclaCaracterEspecial(texto) {
        return ["Backquote", "IntlBackslash", "Comma", "Period", "Slash", "Semicolon", "Quote",
            "Backslash", "BracketLeft", "BracketRight", "Minus", "Equal"].includes(texto)
    }

    /**
     * Modifica el caracter pasado como parametro en base a las teclas activadas
     * @param {String} texto caracter
     * @returns {String} caracter modificado
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

    /**
     * Modifica el caracter especial pasado como parametro en base a las teclas activadas
     * @param {String} texto caracter
     * @returns {String} caracter modificado
     */
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

    /**
     * Modifica el caracter pasado como parametro en base a las teclas activadas
     * @param {String} texto caracter
     * @returns {String} caracter modificado
     */
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

    /**
     * activacio y desactivacion de teclas especial
     * @param {String} texto e.code
     */
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

            case "AltLeft":
                this.altgr = !this.altgr
                break;


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
                this.escribir("<br>")
                break;

            default:
                break;
        }
        this.actualizar()

    }


    /**
     * actualiza la pantalla con el nuevo texto y el estado de las teclas especiales
     */
    actualizar() {
        document.getElementById("textoPantalla").innerHTML = this.texto
        document.getElementById("debugInfo").innerHTML = `
            shift=${this.shift}<br>
            control=${this.control}<br>
            altgr=${this.altgr}<br>
            mayus=${this.mayuscula}`
        // + `<br>alt=${this.alt}`
        if (document.getElementById("visualizacionALternativaTecla").checked) {
            this.alterarTeclado() // altera tambien las teclas del teclado
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

//creacion del objeto
keyboard = new Teclado();

//animacion de cierre y apertura de la pantalla
var cerrado = false
document.getElementById("contenedorPantalla").addEventListener("click", function (e) {
    if (e.target.tagName == "INPUT") {
        return
    }
    if (cerrado) {
        document.getElementById("contenedorPantalla").style.transform = `rotateX(${135}deg)`
    } else {
        document.getElementById("contenedorPantalla").style.transform = `rotateX(${0}deg)`
    }
    cerrado = !cerrado
})
//animacion del principio de la pantalla 
setTimeout(function () { document.getElementById("contenedorPantalla").style.transform = `rotateX(${135}deg)` }, 100)