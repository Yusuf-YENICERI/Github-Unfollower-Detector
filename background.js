


var extension_situation = false;

// var extension_listener = function(){
//     console.log("it also runs!")
    
//     if(extension_situation)
//         browser.browserAction.setPopup({popup: "/popup/options2.html"})
//     else
//         browser.browserAction.setPopup({popup: "/popup/options.html"})
        
// }


browser.runtime.onMessage.addListener((message) => {
    switch(message.command){
        case "Enabled":
            extension_situation = true;
            break;
        case "Disabled":
            extension_situation = false;
            break;
    }
});
// browser.browserAction.onClicked.addListener(extension_listener);