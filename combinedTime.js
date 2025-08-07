/* 
    Adds functionality to combinedRegister.html. Utilizes logic.js
*/

// Stores an object to local storage. Iteration is applied to itemKey if specified.
function setLocalInfo(infoObj, itemKey, iteration = 0) {
    
    if (iteration)
        itemKey += iteration;

    localStorage.setItem(itemKey, JSON.stringify(infoObj));

}

// Receives an object from local storage. Iteration is applied to itemKey if specified.
function getLocalInfo(itemKey, iteration = 0) {

    if (iteration) 
        itemKey += iteration;

    return JSON.parse(localStorage.getItem(itemKey));

}

// Receives an HTML element's value with a supplied id
function getElement(id) {
    return document.getElementById(id).value;
}

// Set an HTML element with a supplied id to a new value
function setElement(id, newValue) {
    document.getElementById(id).value = newValue;
    document.getElementById(id).innerHTML = newValue;
}

// Receives an array with two string values. The first is the hours. The second is the minutes.
function getTimeElements(id) {

    return (getElement(id).split(":").length > 1) ? getElement(id).split(":") : ["", ""];

}

// Receives the year of a local object with the supplied id and iteration
function getDateYear(id, iteration) {

    return getLocalInfo(id, iteration + 1).date.split("-")[0];

}

// Receives the month of a local object with the supplied id and iteration
function getDateMonth(id, iteration) {

    return getLocalInfo(id, iteration + 1).date.split("-")[1];

}

// Receives the day of a local object with the supplied id and iteration
function getDateDay(id, iteration) {

    return getLocalInfo(id, iteration + 1).date.split("-")[2];

}

// Receives all unconfirmed information as an object
function getUnconfirmedInfo() {

    let startHours =   getTimeElements("unconfirmed-start-time")[0];
    let startMinutes = getTimeElements("unconfirmed-start-time")[1];
    let endHours =     getTimeElements("unconfirmed-end-time")[0];
    let endMinutes =   getTimeElements("unconfirmed-end-time")[1];

    let totalWorkingMinutes = ((Number(endHours) - Number(startHours)) * 60) + (Number(endMinutes) - Number(startMinutes));

    return {date:           getElement("unconfirmed-date"),
            startHours:     startHours,
            startMinutes:   startMinutes,
            endHours:       endHours,
            endMinutes:     endMinutes,
            company:        getElement("unconfirmed-comapany"),
            workingHours:   Math.floor(totalWorkingMinutes / 60),
            workingMinutes: Math.round((totalWorkingMinutes / 60 - Math.floor(totalWorkingMinutes / 60)) * 60)}

}

// Updates only the WorkingHours and WorkingMinutes HTML elements with the current unconfirmedInfo 
function updateWorkingTime() {

    if (unconfirmedInfo.workingHours >= 0 && unconfirmedInfo.workingMinutes >= 0) {
        setElement("unconfirmed-working-hours", unconfirmedInfo.workingHours);
        setElement("unconfirmed-working-minutes", unconfirmedInfo.workingMinutes);
    }

} 

// Updates all unconfirmed HTML to the current unconfirmedInfo
function setUnconfirmedHTML() {

    setElement("unconfirmed-date",       unconfirmedInfo.date);
    setElement("unconfirmed-start-time", `${unconfirmedInfo.startHours}:${unconfirmedInfo.startMinutes}`);
    setElement("unconfirmed-end-time",   `${unconfirmedInfo.endHours}:${unconfirmedInfo.endMinutes}`);
    setElement("unconfirmed-comapany",   unconfirmedInfo.company);
    updateWorkingTime();

}

// Confirms any previously unconfirmed information
function confirmUnconfirmedInfo() {

    setLocalInfo(getUnconfirmedInfo(), "confirmedInfo", getConfirmedInfoElements() + 1);

    localStorage.removeItem("unconfirmedInfo");

    location.reload();

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

// Sorts all confirmed information in local storage from the oldest date to the latest
function sortConfirmedInfo() {

    // Swaps two confirmedInfo objects in local storage
    function swapLocal(iteration1, iteration2) {

        let temp = getLocalInfo("confirmedInfo", iteration2 + 1);
                setLocalInfo(getLocalInfo("confirmedInfo", iteration1 + 1), "confirmedInfo", iteration2 + 1);
                setLocalInfo(temp, "confirmedInfo", iteration1 + 1);

    }


    for (let i = 0; i < getConfirmedInfoElements(); i++) {
        for (let j = 0; j < i; j++) {
            if (getDateYear("confirmedInfo", j)  > getDateYear("confirmedInfo", i)  ||
                getDateMonth("confirmedInfo", j) > getDateMonth("confirmedInfo", i) ||
                getDateDay("confirmedInfo", j)   > getDateDay("confirmedInfo", i)
                ) {

                swapLocal(i, j);
            }
        }
    }

}

// Sets an element with the supplied class if it exists
function setClassElement(className, newValue, iteration = 0) {

    if (document.getElementsByClassName(className)[iteration]) {
        document.getElementsByClassName(className)[iteration].innerHTML = newValue;
    }

}

// Adds all confirmed information into HTML
function setConfirmedHTMl() {

    // Creates a new confirmed-info element for each confirmedInfo in local storage and supplies them with appropriate information
    for (let i = 0; i < getConfirmedInfoElements(); i++) {
        let HTMLCopy = document.getElementById("confirmed-info").cloneNode(true);
        HTMLCopy.style.display = "";

        document.getElementById("client-info").append(HTMLCopy);

        setClassElement("date",            getLocalInfo("confirmedInfo", i + 1).date,                                                                 i + 1);
        setClassElement("start-time",      `${getLocalInfo("confirmedInfo", i + 1).startHours}:${getLocalInfo("confirmedInfo", i + 1).startMinutes}`, i + 1);
        setClassElement("end-time",        `${getLocalInfo("confirmedInfo", i + 1).endHours}:${getLocalInfo("confirmedInfo", i + 1).endMinutes}`,     i + 1);
        setClassElement("company",         getLocalInfo("confirmedInfo", i + 1).company,                                                              i + 1);
        setClassElement("working-hours",   getLocalInfo("confirmedInfo", i + 1).workingHours,                                                         i + 1);
        setClassElement("working-minutes", getLocalInfo("confirmedInfo", i + 1).workingMinutes,                                                       i + 1);
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

// Overrides the setConfirmedHTML function in logic.js in favor of its own
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