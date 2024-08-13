function getCards() {

    let infos = getRequest("getCards", "application/json")
    let requestGetCard = infos.then(response => response.json());
    return requestGetCard;

}
