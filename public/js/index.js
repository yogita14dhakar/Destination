// filter logic
let filters = document.getElementsByClassName("filter");
for(let filter of filters){
    filter.addEventListener("click", ()=>{
        let id = filter.id;
        let count = -1;
        for(listing of allListing){
            count++;
            if(id === 'all'){
                document.getElementsByClassName("listing-link")[count].style.display="";
            }
            else if(!listing.filters.includes(id)){
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

// search logic
// let search = document.querySelector(".search-inp");
// let suggestions_container = document.getElementById("suggestions");
// search.addEventListener("input", function() {
//     let query = search.value.toLowerCase();
    // suggestions_container.innerHTML = '';
    // suggestions_container.style.display="block";
// auto complete logic
//     if(query){
//         const unique = new Set();
//             const filtered_Suggestion = allListing.filter(listing =>(
//                 listing.location.toLowerCase().includes(query) || listing.country.toLowerCase().includes(query)
//             ));
        
//             filtered_Suggestion.forEach(listing => {        
//               const div = document.createElement("div");
//               div.className = "suggestion_item";
//               if(!unique.has(listing.country) && listing.country.toLowerCase().includes(query)){
//                 div.textContent = listing.country;
//                 unique.add(listing.country);
//               }else if(!unique.has(listing.location) && listing.location.toLowerCase().includes(query)){
//                 div.textContent = listing.location;
//                 unique.add(listing.location);
//               }
              
//               div.addEventListener("click", ()=>{
//                 if(listing.country.toLowerCase().includes(query)){
//                     search.value = listing.country;
//                 }else if(listing.location.toLowerCase().includes(query)){
//                     search.value = listing.location;
//                 }
//                 suggestions_container.innerHTML = '';
//                 suggestions_container.style.display = "block";
//               });
              
//               suggestions_container.appendChild(div)
//             });  
//     }
// });
// document.addEventListener('click', function(event) {
//     if (!search.contains(event.target) && !suggestions_container.contains(event.target)) {
//       suggestions_container.innerHTML = '';
//       suggestions_container.style.display = "block";
//     }
//     else{
//         suggestions_container.style.display = "none";
//     }
// });
