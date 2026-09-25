
const canvas = document.getElementById("universo");
const ctx = canvas.getContext("2d");

const titulo = document.getElementById("titulo");
const texto = document.getElementById("texto");

let ancho;
let alto;
let centroX;
let centroY;

let mouseX = 0;
let mouseY = 0;

let objetivoX = 0;
let objetivoY = 0;

let zoom = 1;

const estrellas = [];
const corazones = [];
const planetas = [];

const TOTAL_ESTRELLAS = 1600;
const TOTAL_CORAZONES = 120;


// =====================================================
// AJUSTAR PANTALLA
// =====================================================

function ajustarPantalla() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    ancho = window.innerWidth;
    alto = window.innerHeight;

    canvas.width = ancho * dpr;
    canvas.height = alto * dpr;

    canvas.style.width = ancho + "px";
    canvas.style.height = alto + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    centroX = ancho / 2;
    centroY = alto / 2;
}

window.addEventListener("resize", ajustarPantalla);

ajustarPantalla();


// =====================================================
// FUNCIONES
// =====================================================

function aleatorio(min, max) {
    return Math.random() * (max - min) + min;
}


// =====================================================
// CREAR ESTRELLAS
// =====================================================

for (let i = 0; i < TOTAL_ESTRELLAS; i++) {

    estrellas.push({

        x: aleatorio(-2000, 2000),

        y: aleatorio(-2000, 2000),

        z: aleatorio(100, 2200),

        velocidad: aleatorio(0.2, 0.8),

        tamaño: aleatorio(0.4, 2.2),

        brillo: aleatorio(0.3, 1),

        fase: aleatorio(0, Math.PI * 2)
    });
}


// =====================================================
// CREAR CORAZONES
// =====================================================

for (let i = 0; i < TOTAL_CORAZONES; i++) {

    const angulo = Math.random() * Math.PI * 2;

    const radio = aleatorio(180, 950);

    corazones.push({

        angulo: angulo,

        radio: radio,

        velocidad: aleatorio(0.0002, 0.001),

        tamaño: aleatorio(2, 7),

        profundidad: aleatorio(-400, 500),

        fase: aleatorio(0, Math.PI * 2)
    });
}


// =====================================================
// PLANETAS
// =====================================================

planetas.push({
    distancia: 330,
    tamaño: 25,
    velocidad: 0.00035,
    angulo: 0,
    color: "#ff719d"
});

planetas.push({
    distancia: 520,
    tamaño: 35,
    velocidad: 0.00022,
    angulo: 2,
    color: "#9d7cff"
});

planetas.push({
    distancia: 750,
    tamaño: 55,
    velocidad: 0.00012,
    angulo: 4,
    color: "#ffb36b"
});


// =====================================================
// MOVIMIENTO DEL MOUSE
// =====================================================

window.addEventListener("mousemove", function(event) {

    objetivoX =
        (event.clientX / ancho - 0.5) * 2;

    objetivoY =
        (event.clientY / alto - 0.5) * 2;
});


// =====================================================
// ZOOM
// =====================================================

window.addEventListener("wheel", function(event) {

    zoom -= event.deltaY * 0.0007;

    zoom = Math.max(
        0.5,
        Math.min(2.3, zoom)
    );
});


// =====================================================
// PROYECCIÓN 3D
// =====================================================

function proyectar(x, y, z) {

    const perspectiva = 700;

    const escala =
        perspectiva /
        (perspectiva + z);

    return {

        x:
            centroX +
            x * escala * zoom,

        y:
            centroY +
            y * escala * zoom,

        escala:
            escala
    };
}


// =====================================================
// FONDO
// =====================================================

function dibujarFondo() {

    const gradiente =
        ctx.createRadialGradient(
            centroX,
            centroY,
            0,
            centroX,
            centroY,
            Math.max(ancho, alto)
        );

    gradiente.addColorStop(
        0,
        "#16081d"
    );

    gradiente.addColorStop(
        0.45,
        "#08030d"
    );

    gradiente.addColorStop(
        1,
        "#000000"
    );

    ctx.fillStyle = gradiente;

    ctx.fillRect(
        0,
        0,
        ancho,
        alto
    );
}


// =====================================================
// NEBULOSA
// =====================================================

function dibujarNebulosa() {

    const gradiente =
        ctx.createRadialGradient(
            centroX,
            centroY,
            20,
            centroX,
            centroY,
            650 * zoom
        );

    gradiente.addColorStop(
        0,
        "rgba(255,80,160,0.18)"
    );

    gradiente.addColorStop(
        0.35,
        "rgba(150,60,255,0.10)"
    );

    gradiente.addColorStop(
        0.7,
        "rgba(70,50,255,0.04)"
    );

    gradiente.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle = gradiente;

    ctx.beginPath();

    ctx.arc(
        centroX,
        centroY,
        650 * zoom,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// =====================================================
// ESTRELLAS
// =====================================================

function dibujarEstrellas(tiempo) {

    for (const estrella of estrellas) {

        estrella.z -=
            estrella.velocidad * 12;

        if (estrella.z < 20) {

            estrella.z = 2200;

            estrella.x =
                aleatorio(-2000, 2000);

            estrella.y =
                aleatorio(-2000, 2000);
        }

        let x = estrella.x;

        let y = estrella.y;

        let z = estrella.z;


        // Rotación vertical

        const rotX = mouseY * 0.15;

        const cosX = Math.cos(rotX);

        const sinX = Math.sin(rotX);

        const nuevoY =
            y * cosX - z * sinX;

        const nuevoZ =
            y * sinX + z * cosX;

        y = nuevoY;

        z = nuevoZ;


        // Rotación horizontal

        const rotY = mouseX * 0.15;

        const cosY = Math.cos(rotY);

        const sinY = Math.sin(rotY);

        const nuevoX =
            x * cosY - z * sinY;

        const finalZ =
            x * sinY + z * cosY;

        x = nuevoX;

        z = finalZ;


        if (z < -600) {
            continue;
        }


        const punto =
            proyectar(x, y, z);


        const brillo =
            0.55 +
            Math.sin(
                tiempo * 0.002 +
                estrella.fase
            ) * 0.35;


        const tamaño =
            estrella.tamaño *
            punto.escala *
            zoom;


        ctx.beginPath();

        ctx.arc(
            punto.x,
            punto.y,
            Math.max(0.3, tamaño),
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255,255,255,${brillo * estrella.brillo})`;

        ctx.fill();
    }
}


// =====================================================
// CORAZÓN
// =====================================================

function dibujarCorazon(x, y, tamaño, opacidad) {

    ctx.save();

    ctx.translate(x, y);

    ctx.scale(tamaño, tamaño);

    ctx.beginPath();

    ctx.moveTo(0, 0.35);

    ctx.bezierCurveTo(
        -0.5,
        -0.1,
        -0.5,
        -0.55,
        -0.25,
        -0.55
    );

    ctx.bezierCurveTo(
        -0.05,
        -0.55,
        0,
        -0.35,
        0,
        -0.2
    );

    ctx.bezierCurveTo(
        0,
        -0.35,
        0.05,
        -0.55,
        0.25,
        -0.55
    );

    ctx.bezierCurveTo(
        0.5,
        -0.55,
        0.5,
        -0.1,
        0,
        0.35
    );

    ctx.fillStyle =
        `rgba(255,80,150,${opacidad})`;

    ctx.fill();

    ctx.restore();
}


// =====================================================
// CORAZONES FLOTANDO
// =====================================================

function dibujarCorazones(tiempo) {

    for (const corazon of corazones) {

        corazon.angulo +=
            corazon.velocidad * 10;

        const x =
            Math.cos(corazon.angulo) *
            corazon.radio;

        const y =
            Math.sin(corazon.angulo) *
            corazon.radio *
            0.45;

        const z =
            corazon.profundidad +
            Math.sin(
                tiempo * 0.001 +
                corazon.fase
            ) * 50;


        const punto =
            proyectar(
                x,
                y,
                z
            );


        const tamaño =
            corazon.tamaño *
            punto.escala *
            zoom;


        if (tamaño <= 0) {
            continue;
        }


        dibujarCorazon(
            punto.x,
            punto.y,
            tamaño,
            0.55
        );
    }
}


// =====================================================
// PLANETAS
// =====================================================

function dibujarPlanetas() {

    for (const planeta of planetas) {

        planeta.angulo +=
            planeta.velocidad * 16;


        const x =
            Math.cos(planeta.angulo) *
            planeta.distancia;

        const y =
            Math.sin(planeta.angulo) *
            planeta.distancia *
            0.55;

        const z =
            Math.sin(planeta.angulo) *
            180;


        const punto =
            proyectar(
                x,
                y,
                z
            );


        const tamaño =
            planeta.tamaño *
            punto.escala *
            zoom;


        // Órbita

        ctx.beginPath();

        ctx.ellipse(
            centroX,
            centroY,
            planeta.distancia * zoom,
            planeta.distancia * 0.55 * zoom,
            0,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            "rgba(255,150,200,0.08)";

        ctx.lineWidth = 1;

        ctx.stroke();


        // Planeta

        const gradiente =
            ctx.createRadialGradient(
                punto.x - tamaño * 0.35,
                punto.y - tamaño * 0.35,
                1,
                punto.x,
                punto.y,
                tamaño
            );

        gradiente.addColorStop(
            0,
            "#ffffff"
        );

        gradiente.addColorStop(
            0.18,
            planeta.color
        );

        gradiente.addColorStop(
            1,
            "#080008"
        );


        ctx.beginPath();

        ctx.arc(
            punto.x,
            punto.y,
            tamaño,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = gradiente;

        ctx.fill();
    }
}


// =====================================================
// CORAZÓN CENTRAL
// =====================================================

function dibujarCorazonCentral(tiempo) {

    const pulso =
        1 +
        Math.sin(tiempo * 0.004) * 0.08;

    const tamaño =
        100 * zoom * pulso;


    const gradiente =
        ctx.createRadialGradient(
            centroX,
            centroY,
            10,
            centroX,
            centroY,
            tamaño * 2
        );

    gradiente.addColorStop(
        0,
        "rgba(255,70,150,0.5)"
    );

    gradiente.addColorStop(
        0.5,
        "rgba(255,50,130,0.15)"
    );

    gradiente.addColorStop(
        1,
        "rgba(255,0,100,0)"
    );


    ctx.fillStyle = gradiente;

    ctx.beginPath();

    ctx.arc(
        centroX,
        centroY,
        tamaño * 2,
        0,
        Math.PI * 2
    );

    ctx.fill();


    dibujarCorazon(
        centroX,
        centroY,
        tamaño,
        1
    );
}


// =====================================================
// MENSAJES
// =====================================================

const mensajes = [

    {
        titulo: "Para Eve ❤️",
        texto:
            "En todo este universo, mi lugar favorito siempre será contigo."
    },

    {
        titulo: "Nuestro primer aniversario 😭✨",
        texto:
            "Un año de momentos, risas, abrazos y recuerdos que quiero seguir construyendo contigo."
    },

    {
        titulo: "Gracias por estar conmigo flaca💗",
        texto:
            "Gracias por cada momento bonito, por acompañarme y por hacer especial mi vida."
    },

    {
        titulo: "Tú y yo 🌌",
        texto:
            "Si pudiera elegir cualquier lugar del universo, volvería a elegir estar a tu lado."
    },

    {
        titulo: "Mi persona favorita ❤️",
        texto:
            "Entre millones de estrellas, de alguna manera encontré la que más ilumina mi vida, se llama EVELINE"
    },

    {
        titulo: "Y esto apenas comienza ✨",
        texto:
            "Quiero seguir creando recuerdos contigo y descubrir todo lo que todavía nos falta vivir."
    },

    {
        titulo: "Te AMO, Eveline ❤️",
        texto:
            "Gracias por formar parte de mi vida. Feliz primer aniversario."
    }
];

let mensajeActual = 0;

function cambiarMensaje() {

    titulo.style.opacity = "0";
    texto.style.opacity = "0";

    setTimeout(() => {

        titulo.textContent =
            mensajes[mensajeActual].titulo;

        texto.textContent =
            mensajes[mensajeActual].texto;

        titulo.style.opacity = "1";
        texto.style.opacity = "1";

        mensajeActual++;

        if (mensajeActual >= mensajes.length) {
            mensajeActual = 0;
        }

    }, 500);
}


setInterval(
    cambiarMensaje,
    5000
);


// =====================================================
// ANIMACIÓN
// =====================================================

function animar(tiempo) {

    mouseX +=
        (objetivoX - mouseX) * 0.04;

    mouseY +=
        (objetivoY - mouseY) * 0.04;


    dibujarFondo();

    dibujarNebulosa();

    dibujarEstrellas(tiempo);

    dibujarCorazones(tiempo);

    dibujarPlanetas();

    dibujarCorazonCentral(tiempo);


    requestAnimationFrame(animar);
}

requestAnimationFrame(animar);

