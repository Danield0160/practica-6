class Teclado {
    shift = false;
    control = false;
    alt = false;
    altgr = false;
    mayuscula = false
    texto = ""
    sizeFila = 20
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
            if(e.code == "F5"){
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
            //hace que esas teclas al levantarse no se ejecuten, ya que se ejecuta en keydown
            if (this.esTeclaEspecial(e.code) && !(["Space", "Tab", "Enter","MetaLeft","MetaRight"].includes(e.code))) {
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
        if (this.esTeclaEspecial(texto)) {
            this.ejecutarTeclaEspecial(texto)
        }
        if (this.esTeclaNormal(texto)) {
            this.escribir(this.alterarCaracter(texto.slice(-1).toLowerCase()))
        }
        if(this.esTeclaNumerica(texto)){
            this.escribir(this.alterarNumero(texto.slice(-1).toLowerCase()))

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
        if (this.esNecesarioSaltoDeLinea()) {
            this.ejecutarTeclaEspecial("Enter")
        }
        this.texto += texto
        this.actualizar()
    }

    esTeclaEspecial(texto) {
        if (["Tab", "CapsLock", "ShiftLeft", "ControlLeft", "MetaLeft", "AltLeft", "Space", "AltRight","MetaRight", "ControlRight", "ShiftRight", "Enter"].includes(texto)) {
            return true
        }
        return false
    }

    /**
     * 
     * @param {String} texto 
     * @returns {boolean}
     */
    esTeclaNormal(texto) {
        if (texto.startsWith("Key")) {
            return true
        }
        return false
    }

    esTeclaNumerica(texto) {
        if (texto.startsWith("Digit")) {
            return true
        }
        return false
    }

    //TODO: alterar texto en base a los atributos y los numericos
    /**
     * 
     * @param {string} texto 
     * @returns {String}
     */
    alterarCaracter(texto) {
        if (this.shift) {
            texto = texto.toUpperCase()
        }
        if (this.altgr) {
            if (texto == "e") {
                return "€"
            }
            if(texto == "E"){
                return ""
            }
        }

        return texto
    }
    alterarNumero(texto){
        if (this.shift) {
            return ['=', '!', '"', '·', '$', '%', '&', '/', '(', ')'][Number(texto)]
        }
        return texto
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

            case "AltLeft":
                this.alt = !this.alt
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
                this.texto +="<br>"
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