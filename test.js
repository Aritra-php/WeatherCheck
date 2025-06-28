//weatherAPI.com

document.addEventListener("DOMContentLoaded", ()=>{ //JS event listener that runs the JS code after the HTML document is runned and lodded

const apiKey = 'a852c671f0mshecde7481f7084d9p124507jsn0cd93a7cdc8c'; // my personal RapidAPI key
const apiHost = 'weatherapi-com.p.rapidapi.com'; //api host 

const cityInput=document.getElementById("city-input");
const searchBtn=document.getElementById("search-btn");
const errMsg=document.getElementById("error-message");
const currentWeather=document.getElementById("current-weather"); 
const forcastWeather=document.getElementById("forecast-weather"); 
const alertsContainer=document.getElementById("alerts-container");



//event listener on search btn
searchBtn.addEventListener('click', ()=>{
    fetchWeather(cityInput.value);
});

//event listener on search bar
cityInput.addEventListener('keypress', e=>{
    if(e.key=== 'Enter')
        fetchWeather(cityInput.value);
});


//function to fetch weather
async function fetchWeather(city) {    //async function which returns a promise(JS object containing result of async function operation)
    if(!city) return showError("Please enter a valid city name");

    const url = `https://${apiHost}/forecast.json?q=${encodeURIComponent(city)}&days=3&alerts=yes`; //api end point 

    try{
        const res= await fetch(url, {     //fetch:Calls the api which return the promise, await:pauses the code until async function gives the result(promise)
            method: 'GET', 
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost
            }
        });
        const data= await res.json(); //res.json: converts the response from api into json format(JS object), await: Pauses the code until conversion is done(parsing)
        if(data.error) return showError(data.error.message);
        renderWeather(data);   //passing the data variable in renderweather to display the data in UI
    }catch(err){
        showError('Error fetching the data');
        console.log(err);
    }
};

//function to display weather in UI
function renderWeather(data){ //data passed as parameter which contains weather data received from api
  
  errMsg.classList.add('hidden');        // hide any previous error
  currentWeather.classList.remove('hidden');   // hide old current-weather section
  forcastWeather.classList.remove('hidden');  // hide old forecast section
  
  //code for diplaying data in current weather section
  document.getElementById("city-name").textContent = data.location.name + "," +data.location.country; 
  document.getElementById("current-temp").textContent = data.current.temp_c; 
  document.getElementById("current-desc").textContent = data.current.condition.text; 
  document.getElementById("wind").textContent = data.current.wind_kph; 
  document.getElementById("humidity").textContent = data.current.humidity; 
  document.getElementById("sunrise").textContent = data.forecast.forecastday[0].astro.sunrise; 
  document.getElementById("sunset").textContent = data.forecast.forecastday[0].astro.sunset; 

  //code for forcast weather section
  forcastWeather.innerHTML=''; 
  data.forecast.forecastday.forEach(day =>{
    const card = document.createElement('div');
    card.className = 'forcast-card'; 
    card.innerHTML = `
    <h3>${new Date(day.date).toDateString()}</h3>
    <p><strong>${day.day.avgtemp_c}°C</strong></p>
    <p>${day.day.condition.text}</p>`;                

    forcastWeather.appendChild(card);

  });

  //code for alert section 
  const alerts = data.alerts?.alert || [];    /* data.alerts?: JS optional chaning function(?) which will check if data.alerts is not null. 
                                                If it is null it will convert it into an empty array, 
                                             if not null then data.alerts will get executed                                                                       */
  alertsContainer.innerHTML = '';
  if(alerts.length === 0){
    alertsContainer.innerHTML= '<p>No Weather Alerts at the moment</P>';
  }else{
    alerts.forEach(alert =>{
      const card = document.createElement('div'); 
      card.className = 'alert-card'; 
      card.innerHTML = `
      <h3>${alert.headline}</h3>
      <p><strong>Event:</strong> ${alert.event}</p>
      <p><strong>Severity:</strong> ${alert.severity}</p>
      <p><strong>Effective:</strong> ${new Date(alert.effective).toLocaleString()}</p>
      <p><strong>Expires:</strong> ${new Date(alert.expires).toLocaleString()}</p>
      <p>${alert.desc}</p>`; 

      alertsContainer.appendChild(card);
    });
  }
  alertsContainer.classList.remove('hidden');

  // Extract local hour from the API's localtime
  const localTime = data.location.localtime; // format: "2025-06-26 14:30"
  const localHour = new Date(localTime).getHours();

  // Get current weather card
  // const currentWeatherSection = document.getElementById("current-weather");

  // Apply theme based on local time
  if (localHour >= 18 || localHour < 6) {
    currentWeather.classList.add("dark-mode");
    currentWeather.classList.remove("light-mode");
  } else {
    currentWeather.classList.add("light-mode");
    currentWeather.classList.remove("dark-mode");
  }

};


//function to implement error messages 
function showError(msg){
    errMsg.textContent=msg; 
    errMsg.classList.remove('hidden'); 
    currentWeather.classList.add('hidden'); //to prevent the show of old or invalid weather data where something goes wrong during search
    forcastWeather.classList.add('hidden');
    alertsContainer.classList.add('hidden');
};

});
