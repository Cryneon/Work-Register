/* 
    Adds functionality to combinedRegister.html. Utilizes logic.js
*/

// Overrides the 
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