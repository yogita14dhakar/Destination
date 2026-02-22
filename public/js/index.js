// filter logic
let filters = document.getElementsByClassName("filter");
for(let filter of filters){
    filter.addEventListener("click", ()=>{
        let id = filter.id;
        let count = -1;
        for(listing of allListing){
            count++;
            if(!listing.filters.includes(id)){
                document.getElementsByClassName("listing-link")[count].style.display="none";
            }
            else{
                document.getElementsByClassName("listing-link")[count].style.display="";
            }
        }
    });
}

// taxSwitch toggle logic
let taxSwitch = document.getElementById("flexSwitchCheckDefault");
taxSwitch.addEventListener("click", () => {
    let taxInfo = document.getElementsByClassName("tax-info");
    for(info of taxInfo){
        if(info.style.display != "inline"){
            info.style.display = "inline";
        }else{
            info.style.display = "none";
        }
    }
});
