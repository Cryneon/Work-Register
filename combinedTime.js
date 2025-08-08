/* 
    Adds functionality to combinedRegister.html
*/

// Receives an object from local storage. Iteration is applied to itemKey if specified.
function getLocalInfo(itemKey, iteration = 0) {

    if (iteration) 
        itemKey += iteration;

    return JSON.parse(localStorage.getItem(itemKey));

}

// Receives the current amount of confirmedInfo elements in local storage
function getConfirmedInfoElements() {

    let elements = 0;

    for (let i = 0; i < localStorage.length; i++) {
        if (getLocalInfo("confirmedInfo", i + 1)) 
            elements++;
    }

    return elements;

}

// Sets an element with the supplied class if it exists
function setClassElement(className, newValue, iteration = 0) {

    if (document.getElementsByClassName(className)[iteration]) {
        document.getElementsByClassName(className)[iteration].innerHTML = newValue;
    }

}

// Receives an array of objects. Each object contains a company and its total corresponding minutes 
function combinedTimePerCompany() {

    let companies = [];

    for (let i = 0; i < getConfirmedInfoElements(); i++) {

        let isExisting = false;

        for (let j = 0; j < companies.length; j++) {
            if (getLocalInfo("confirmedInfo", i + 1).company === companies[j].company) {
                companies[j].time += (getLocalInfo("confirmedInfo", i + 1).workingHours * 60 + getLocalInfo("confirmedInfo", i + 1).workingMinutes);
                isExisting = true;
                break;
            }
        }
        
        if (!isExisting) {
            companies.push({company: getLocalInfo("confirmedInfo", i + 1).company, time: getLocalInfo("confirmedInfo", i + 1).workingHours * 60 + getLocalInfo("confirmedInfo", i + 1).workingMinutes});
        }
    }

    return companies;

}

// Adds each company and their respective worked hours into HTML
function setConfirmedHTML() {

    let companies = combinedTimePerCompany();

    for (let i = 0; i < companies.length; i++) {

        let HTMLCopy = document.getElementById("confirmed-info").cloneNode(true);
        HTMLCopy.style.display = "";

        document.getElementById("client-info").append(HTMLCopy);

        setClassElement("company", companies[i].company, i + 1);
        setClassElement("hours", Math.floor((companies[i].time / 60) * 100) / 100, i + 1);
        }
        
}

setConfirmedHTML();