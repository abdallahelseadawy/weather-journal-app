/* Global Variables */
const zipElement = document.getElementById('zip');
const feelingsElement = document.getElementById('feelings');

// Base URL and API Key for OpenWeatherMap API
const baseURL = 'http://api.openweathermap.org/data/2.5/weather';
const apiKey = '<your_api_key>&units=imperial'; //Imperial: Fahrenheit, api key has been removed because it was considered as a leak from GitGuardian

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', callback);

function callback (){
    // get weather temprature given the zip code 
    getWebApiData(zipElement.value).then(
        function(data) {
            // add data to POST request
            postData('/add', { date: newDate, temp: data.main.temp, content: feelingsElement.value, cityName: data.name });
        }
    ).then(
        function() {
            // call retrieveData to update browser content
            retrieveData();
        }
    ).catch(
        // Error Handling
        function(error) {
            console.log(error);
            alert('Please Enter a Valid ZIP Code!');
        }
    );

}

/* Function to GET Web API Data*/
async function getWebApiData(zip){
    const res = await fetch(`${baseURL}?zip=${zip}&appid=${apiKey}`);
    try {
        // retreive the result of the fetch function
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('error', error);
    }
}

//Updating Web Content or UI just as mentioned in the project rubric
const retrieveData = async () =>{
    const request = await fetch('/all');
    try {
        // Transform into JSON
        const allData = await request.json()
        console.log(allData)
        // Write updated data to DOM elements
        document.getElementById('temp').innerHTML = Math.round(allData.temp)+ ' degrees';
        document.getElementById('content').innerHTML = allData.content;
        document.getElementById('date').innerHTML =allData.date;
        document.getElementById('cityName').innerHTML =allData.cityName;
    }
    catch(error) {
        console.log('error', error);
        // appropriately handle the error
    }
   }

/* Function to POST data */
const postData = async(url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            temp: data.temp,
            date: data.date,
            content: data.content,
            cityName: data.cityName
        })
    });
    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log(error);
    }
};