async function getCartes() {
    let resultRequest = await getInfos("getCartes", "application/json");
    console.log(resultRequest);
}