/* LANGUAGE */

let mainHeading1st = document.querySelector('.main-heading-1st'),
mainHeading2nd = document.querySelector('.main-heading-2nd'),
thnxText1st = document.querySelector('.thnx-text-1st'),
thnxText2nd = document.querySelector('.thnx-text-2nd'),
hoursSpan = document.querySelector('.hours-span'),
minutesSpan = document.querySelector('.minutes-span'),
secondsSpan = document.querySelector('.seconds-span');

if (document.documentElement.lang == "ru") {
    document.title = 'Поздравляем!';
    mainHeading1st.innerHTML = 'Спасибо!';
    mainHeading2nd.innerHTML = 'Ваша заявка принята';
    thnxText1st.innerHTML = 'Для получения полного доступа к работе с платформой необходимо дождаться звонка персонального консультанта.';
    thnxText2nd.innerHTML = 'Ваш персональный консультант свяжется с вами в течении 24 часов.';
    hoursSpan.innerHTML = 'часов';
    minutesSpan.innerHTML = 'минут';
    secondsSpan.innerHTML = 'секунд';
}  else if (document.documentElement.lang == "es") {
    document.title = '¡Felicidades!';
    mainHeading1st.innerHTML = '¡Gracias!';
    mainHeading2nd.innerHTML = 'Su solicitud es aceptada';
    thnxText1st.innerHTML = 'Para obtener acceso completo para trabajar con la plataforma, debe esperar una llamada de su asesor personal.';
    thnxText2nd.innerHTML = 'Su asesor personal se comunicará con usted en un plazo de 24 horas.';
    hoursSpan.innerHTML = 'horas';
    minutesSpan.innerHTML = 'minutos';
    secondsSpan.innerHTML = 'segundos';
} else if (document.documentElement.lang == "pl") {
    document.title = 'Gratulacje!';
    mainHeading1st.innerHTML = 'Dziękuję Ci!';
    mainHeading2nd.innerHTML = 'Twoja aplikacja została zaakceptowana';
    thnxText1st.innerHTML = 'Aby uzyskać pełny dostęp do pracy z platformą, musisz poczekać na telefon od osobistego konsultanta.';
    thnxText2nd.innerHTML = 'Twój osobisty konsultant skontaktuje się z Tobą w ciągu 24 godzin.';
    hoursSpan.innerHTML = 'godziny';
    minutesSpan.innerHTML = 'minuty';
    secondsSpan.innerHTML = 'sekundy';
} else if (document.documentElement.lang == "it") {
    document.title = 'Congratulazioni!';
    mainHeading1st.innerHTML = 'Grazie!';
    mainHeading2nd.innerHTML = 'La tua domanda è accettata';
    thnxText1st.innerHTML = 'Per avere pieno accesso al lavoro con la piattaforma, devi attendere una chiamata dal tuo consulente personale.';
    thnxText2nd.innerHTML = 'Il tuo consulente personale ti contatterà entro 24 ore.';
    hoursSpan.innerHTML = 'ore';
    minutesSpan.innerHTML = 'minuti';
    secondsSpan.innerHTML = 'secondi';
} else if (document.documentElement.lang == "de") {
    document.title = 'Herzlichen Glückwunsch!';
    mainHeading1st.innerHTML = 'Danke!';
    mainHeading2nd.innerHTML = 'Ihre Bewerbung wird angenommen';
    thnxText1st.innerHTML = 'Um vollen Zugriff auf die Arbeit mit der Plattform zu erhalten, müssen Sie auf einen Anruf von Ihrem persönlichen Berater warten.';
    thnxText2nd.innerHTML = 'Ihr persönlicher Berater wird Sie innerhalb von 24 Stunden kontaktieren.';
    hoursSpan.innerHTML = 'Stunden';
    minutesSpan.innerHTML = 'Minuten';
    secondsSpan.innerHTML = 'Sekunden';
}else {
    document.title = 'Congratulations!';
    mainHeading1st.innerHTML = 'Thank you!';
    mainHeading2nd.innerHTML = 'Your application is accepted';
    thnxText1st.innerHTML = 'To get full access to working with the platform, you need to wait for a call from your personal consultant.';
    thnxText2nd.innerHTML = 'Your personal consultant will contact you within 24 hours.';
    hoursSpan.innerHTML = 'hours';
    minutesSpan.innerHTML = 'minutes';
    secondsSpan.innerHTML = 'seconds';
}
// URL autologin
var apiUrl = '../check.php'

function request(id) {
    return new Promise(function (resolve, reject) {
        return axios.get(apiUrl + '?id=' + id, {
            id
        })
            .then(function (response) {
                resolve(response.data.result)
            })
            .catch(function (error) {
                reject(error)
            })
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function autologinUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('hash')
    request(id)
        .then(function (response) {
            if (response.url) {
                window.location = response.url
            } else {
                sleep(60000).then(function () {
                    autologinUrl()
                })
            }
        })
        .catch(function (e) {
            console.error(e)
        })
}

autologinUrl()