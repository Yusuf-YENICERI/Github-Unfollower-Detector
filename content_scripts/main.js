/*                                      BİSMİLLAHİRRAHMANİRRAHİM
**                                            ELHAMDÜLİLLAH
**                                             ALLAHU EKBER
*/


( function() {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRun) {
      return;
    }
    window.hasRun = true;
    
    
    
    async function enableExtension() {
        // console.log(`message sent Alhamdulillah!`)

        try {
          

          let allPeopleForm = Array.prototype.slice.call(document.getElementsByClassName("js-form-toggle-target"));
          let personal_token = await browser.storage.local.get("tokenId");
          if(personal_token.tokenId == null){
            window.alert("No token provided!");
            return;
          }
          
          
          allPeopleForm.forEach(async (form) => {

            let personal_token = await browser.storage.local.get("tokenId");
            personal_token = personal_token.tokenId;
            
            
            
            let currentUsername = "";
            if((await browser.storage.local.get("userId")).userId == null ){
              currentUsername = document.getElementsByClassName("avatar avatar-small circle")[0].alt;
              currentUsername = currentUsername.slice(1,currentUsername.length);
              await browser.storage.local.set({"userId" : currentUsername})
            }else{
              currentUsername = (await browser.storage.local.get("userId")).userId;
            }

            let newDiv = document.createElement("div");
            newDiv.className = "ghfollowerdetector";
            newDiv.innerText = `Following you !`;

            if(!form.hidden){
                let action = form.action;
                let formUsername = action.slice(action.indexOf("=")+1, action.length);
                let resultUser = await fetch(`https://api.github.com/users/${formUsername}/following/${currentUsername}`,  {method:'GET', headers:{"Accept":"application/vnd.github.v3+json", "Authorization":`token ${personal_token}`}})

                if(resultUser.status == 204){                
                    form.appendChild(newDiv)
                }
            }

          });

        } catch (error) {
          
            console.log(`message can't be sent: ${error}`);
        
        }
    }

    function disableExtension() {

        // console.log("disable message sent Alhamdulillah !");

        let allPeopleDivs = document.getElementsByClassName("ghfollowerdetector");
        for(;allPeopleDivs[0];){
          allPeopleDivs[0].parentNode.removeChild(allPeopleDivs[0]);
        }

    }

    browser.runtime.onMessage.addListener(async (message) => {
        switch(message.command){
            case "Enabled":
                await enableExtension();
                break;
            case "Disabled":
                disableExtension();
                break;
        }
    });

  
  })();



  