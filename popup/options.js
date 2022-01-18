/**
 *                              BİSMİLLAHİRRAHMANİRRAHİM
 *                                  ELHAMDÜLİLLAH
 *                                   ALLAHU EKBER
 */





function recursiveClassChecker(target, className){

    if(target == null)
        return false;

    if (target.className == className)
        return true;

    return recursiveClassChecker(target.parentElement, className);
}





/**
* Listen for clicks on the buttons, and send the appropriate message to
* the content script in the page.
*/
function listenForClicks() {


    

    let domContentChecker = async (e) => {

        let result = await browser.storage.local.get("active");
        switch (result.active) {
            case undefined:
                await browser.storage.local.set({"active": "false"});
                break;
            case "true":
                let wheel = document.querySelector(".wheel");
                let status = document.querySelector(".status");
                let green = document.querySelector(".green"); 
                status.innerText = "Enabled";
                wheel.style.transform = "translateX(70%) scale(1.2)";
                green.style.backgroundColor = "rgb(7, 244, 7)";
            default:
                break;
        }

        let username = await browser.storage.local.get("userId");
        if(username.userId == null){
            console.log("no username");
        }else{
            document.getElementById("user-id").value = username.userId;
        }

        let token = await browser.storage.local.get("tokenId");
        if(token.tokenId == null){
            console.log("no token");
        }else{
            document.getElementById("token-id").value = token.tokenId;
        }

    }

    if( document.readyState !== 'loading' ) {
        domContentChecker(null);
    } else {
        document.addEventListener('DOMContentLoaded', domContentChecker);
    }


    document.addEventListener("click", async (e) => {

        
        async function changeActiveness(tabs) {

            let wheel = document.querySelector(".wheel");
            let status = document.querySelector(".status");
            let green = document.querySelector(".green");
            
            if(status.innerText == "Enabled"){
                wheel.style.transform = "scale(1.2)";
                status.innerText = "Disabled";
                green.style.backgroundColor = "red";

                await browser.storage.local.set({"active":"false"});
            }else{
                status.innerText = "Enabled";
                wheel.style.transform = "translateX(70%) scale(1.2)";
                green.style.backgroundColor = "rgb(7, 244, 7)";

                await browser.storage.local.set({"active":"true"});
            }

            browser.tabs.sendMessage(tabs[0].id, {
                command: status.innerText
            });
        }

        /**
        * Just log the error to the console.
        */
        function reportError(error) {
            console.error(`Could not detect: ${error}`);
        }

        async function getToken() {
            let username = document.getElementById("user-id").value.toString();
            let token = document.getElementById("token-id").value.toString();
            if(token.length == 0){
                window.alert("No token provided!");
                return false;
            }else if (username.length == 0){
                window.alert("No username provided!");
                return false;
            }
            else{
                await browser.storage.local.set({"tokenId" : token})
                await browser.storage.local.set({"userId" : username})
                return true;
            }
        }

        async function checkToken() {
            let token = document.getElementById("token-id").value;
            if(token.length == 0){
                window.alert("No token provided!");
                return false;
            }
            else{
                return true;
            }
        }

        

        /**
        * Get the active tab,
        * then call "beastify()" or "reset()" as appropriate.
        */

        if (recursiveClassChecker(e.target, "item")) {
            if(await checkToken())
                browser.tabs.query({active: true, currentWindow: true})
                .then(changeActiveness)
                .catch(reportError);
        }else if (recursiveClassChecker(e.target, "save")) {
            browser.tabs.query({active: true, currentWindow: true})
            .then(getToken)
            .then((data)=>{
                if(data)
                    window.alert("Token saved");
            })
            .catch(reportError);
        }
        else if (e.target.classList.contains("reset")) {
            browser.tabs.query({active: true, currentWindow: true})
            .then(reset)
            .catch(reportError);
        }
        });
}

/**
* There was an error executing the script.
* Display the popup's error message, and hide the normal UI.
*/
function reportExecuteScriptError(error) {
    console.error(`Failed to execute script: ${error.message}`);
}

/**
* When the popup loads, inject a content script into the active tab,
* and add a click handler.
* If we couldn't inject the script, handle the error.
*/
browser.tabs.executeScript({file: "/content_scripts/main.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);
