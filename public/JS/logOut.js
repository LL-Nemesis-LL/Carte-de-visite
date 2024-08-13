function sendLogOut() {
    getRequest("logout", "application.json")
        .then(message => {
            if (message["result"] == true) {
                window.location.href = "/";
            }
        })
}