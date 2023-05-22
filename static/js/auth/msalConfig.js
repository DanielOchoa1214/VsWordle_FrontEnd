let loginConfig = (function () { 
    let _publicStuff = {};
    
    const msalConfig = {
        auth: {
            // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
            clientId: "122f2365-7777-4ab2-b238-0117ac11d970",
            // Full directory URL, in the form of https://login.microsoftonline.com/<tenant-id>
            authority: "https://login.microsoftonline.com/301c0eea-7041-4543-8e95-e1737121c99c",
            // Full redirect URL, in form of http://localhost:3000
            redirectUri: "https://arsw-vswordle.eastus.cloudapp.azure.com",
        },
        cache: {
            cacheLocation: "sessionStorage", // This configures where your cache will be stored
            storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
        }
    };

    const MSALobj = new msal.PublicClientApplication(msalConfig);

    _publicStuff.SignIn = function () {
        const loginScope = {
            scope: ["User.Read"]
        };
        MSALobj.loginRedirect(loginScope);
    }

    MSALobj.handleRedirectPromise().then((res) => {
        console.log(res);
        if(res){
            $('#user-account').text(`Hola bb: ${res.account.name}`)
        }
    }).catch(err => console.log(err));

    return _publicStuff;
})();