// initializng map 
let earth = 0
let marker = 0

const people = document.getElementsByClassName('people')[0];

people.addEventListener('click', () => {
    document.querySelector('ul').style.visibility = 'visible'
})


const ISS_currentStatus = {
    coordinates: null,
    ISS_Info: null
}


//targeting people div from html to fetch data of people onboard








const getISSInfo = () => {
    return fetch('http://api.open-notify.org/astros.json')
        .catch(err => console.log('Error Encountered while request', err))
        .then(response => response.json())


}

const initialize = () => {
    earth = new WE.map('earth_div');
    WE.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=4gNFBZTNJBrP58XsEqpi', {
        attribution: '\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e'
    }).addTo(earth);

}


const getCoordinates = () => {
    fetch('http://api.open-notify.org/iss-now.json')
        .catch(err => console.log('error Encountered while request', err))
        .then(response => response.json())
        .then(response => setCoordinates(response))
}

const setCoordinates = response => {
    const coordinates = response.iss_position
    ISS_currentStatus.coordinates = [coordinates.longitude, coordinates.latitude]
    setMarker()
}



const setMarker = () => {

    if (typeof marker != 'number')
        marker.removeFrom(earth)

    marker = WE.marker(ISS_currentStatus.coordinates).addTo(earth)


    marker.bindPopup(`<p>International Space Station<br>coordinates : ${ISS_currentStatus.coordinates}</p><hr>
    <p>Number Of People ${ISS_currentStatus.ISS_Info.number}<p>`, {
        maxWidth: 120,
        closeButton: false
    }).openPopup();
}




getCoordinates() //fetch coordinates of ISS

getISSInfo() //fetch info about ISS
    .then(response => {

        ISS_currentStatus.ISS_Info = response
    })
    .then(() => {


        ISS_currentStatus.ISS_Info.people.forEach(element => {
            let person = document.createElement('li')
            person.textContent = `${element.name} : ${element.craft}`
            document.querySelector('ul').appendChild(person)
        });


    })



setInterval(getCoordinates, 3000)