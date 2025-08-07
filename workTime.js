/* 
    Adds functionality to index.html. Utilizes logic.js
*/

// Initially sets unconfirmedInfo to the current unconfirmed information
let unconfirmedInfo = getUnconfirmedInfo();

// Adjusts unconfirmedInfo to the unconfirmedInfo in local storage if it exists
if (getLocalInfo("unconfirmedInfo")) {
    unconfirmedInfo = getLocalInfo("unconfirmedInfo");
}

sortConfirmedInfo();

setUnconfirmedHTML();

setConfirmedHTMl();

addEventListener("change", function() {

    // Updates both instances of unconfirmedInfo
    unconfirmedInfo = getUnconfirmedInfo();
    setLocalInfo(unconfirmedInfo, "unconfirmedInfo");

    updateWorkingTime();

});

// Adds functionality to the submit button by means of storing information into local storage
document.getElementById("submit").addEventListener("click", confirmUnconfirmedInfo);

// Adds functionality to all the delete buttons by means of setting all elements after the chosen one to the element after them. Then, the last element is deleted. 
for (let i = 0; i < getConfirmedInfoElements(); i++) {
    document.getElementsByClassName("delete")[i + 1].addEventListener("click", function() {
        
        for (let j = i + 1; j < getConfirmedInfoElements(); j++) {
            setLocalInfo(getLocalInfo("confirmedInfo", j + 1), "confirmedInfo", j);
        }
        
        localStorage.removeItem(`confirmedInfo${getConfirmedInfoElements()}`);

        location.reload();

    });
}
