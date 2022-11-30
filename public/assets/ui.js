//Counts
let searchResultsCount = 0;

//States
let noProductMatchesIndicatorState = `hidden`;

//Actors
let searchQueryInput = document.getElementById("searchQueryInput")
let productSearchNoResultsIndicator = document.getElementById("productSearchNoResultsIndicator")
let productSearchResultsList = document.getElementById("productSearchResultsList")


//Listeners
searchQueryInput.addEventListener('input', (event) => {
    searchQueryWatcher()
});
searchQueryInput.addEventListener('keyup', (event) => {
    searchQueryWatcher()
});

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM loaded');
});

window.addEventListener('load', (event) => {
    console.log(`All dependencies are loaded.`);
});

//Functions

//BEGIN:Show Search Results
////Shows the matching search results. Pass it a duration in seconds
function showSearchResults(duration) {
    console.log(`Showing search results over ${duration} seconds...`);
    gsap.to(productSearchResultsList, {
        autoAlpha: 1,
        ease: Linear.easeNone,
        duration: duration
    })
}
//END:Show Search Results

//BEGIN:Hide Search Results
////Hides the search results. Pass it a duration in seconds
function hideSearchResults(duration) {
    console.log(`Hiding search results over ${duration} seconds...`);
    gsap.to(productSearchResultsList, {
        autoAlpha: 0,
        ease: Linear.easeNone,
        duration: duration
    })
}
//END:Hide Search Results

//BEGIN:Search Query Watcher
////Watches the Search Query input for changes.
function searchQueryWatcher() {
    console.log(`Search Query Watcher detected a change`)
    //Hide any visible ratings to re-enable fade-in
    gsap.to('.rating', {
        duration: 0.05,
        ease: Linear.easeNone
    })
    hideSearchResults(0.08)

    let searchQuery = searchQueryInput.value;
    console.log(`New search query is ${searchQuery}`)
    let queryCharacterCount = searchQuery.length;
    if (queryCharacterCount > 0) {
        fetcher(`productSearch`, searchQuery)
    } else {
        console.log(`Not enough characters to query products`)
        hideSearchResults(0.08)
        hideNoProductMatchesIndicator()
    }

}
//END:Search Query Watcher

//BEGIN:Fetcher
////Interfaces with an API. Pass it the API name as the first parameter & additional parmaters thereafter
function fetcher(api, query) {
    console.log(`Got a request to call ${api} api`)
    if (api == `productSearch`) {
        console.log(`Ready to get data from products search API with query ${query}`)
        fetch(`https://dummyjson.com/products/search?q=${query}`)
            .then((response) => response.json())
            .then((data) => resultsParser(data))
            .catch((error) => {
                console.log('Failed to query products:', error);
                console.error('Couldnt query products, show the error indicator')
                hideSearchResults(0.08)
            });
    }
}
//END:Fetcher

//BEGIN:Results Parser
////Parses results after a search. Pass it a JSON object
function resultsParser(results) {
    console.log(`Ready to parse ${results}...`)
    results = results.products
    let resultsCount = results.length;
    console.log(`Got ${resultsCount} results`)

    if (resultsCount > 0) {
        console.log(`Found matching products, show the resultsList`)
        hideNoProductMatchesIndicator()
        renderProductResults(results);
        setTimeout(() => {
            showSearchResults(0.08)
        }, 355);

    } else {
        console.log(`No matching products, show the no results indicator`)
        showNoProductMatchesIndicator()
        hideSearchResults(0.08)

    }
}
//END: Results Parser

//BEGIN:Show No Product Matches Indicator
////Shows the no product matches indicator
function showNoProductMatchesIndicator() {
    gsap.to(productSearchNoResultsIndicator, {
        autoAlpha: 1,
    }) & (noProductMatchesIndicatorState = `visible`)
}
//END: Show No Product Matches Indicator

//BEGIN:Hide No Product Matches Indicator
////Hides the no product matches indicator
function hideNoProductMatchesIndicator() {
    gsap.to(productSearchNoResultsIndicator, {
        autoAlpha: 0,
    }) & (noProductMatchesIndicatorState = `hidden`)
}
//END: Hides the No Product Matches Indicator

//BEGIN:  Render Product Results
////Renders a list of product results
function renderProductResults(results) {
    productSearchResultsList.innerHTML = ``;
    console.log(`Got ${results.length} products to render`)
    results.forEach((result) => {
        //Creating a random throwaway 5 character ID to append to this result (Required to draw ratings stars & apply fade in to thumbnails)
        let resultID = Math.random().toString(36).slice(2, 7);
        //Getting the thumbnail image link for the result. The dummyjson.com/products API always sends the thumbnail as the last image
        let thumbnailImageLink = result.images.pop();
        console.log(`Got a thumbnail link as ${thumbnailImageLink}`)
        //Creating the image as a javascript object, this is required to gracefully hide the loading indicator & allows to handle image load failures
        let thumbnailImage = new Image(0, 0);
        thumbnailImage.src = thumbnailImageLink;

        //Insert the result to the DOM
        productSearchResultsList.insertAdjacentHTML('afterbegin', `
        <div class="result">
            <div class="left">
            <div id="thumbnail${resultID}" class="thumbnail";background-size:cover"></div>
            <div class="name">
             <div class="title">${result.title}</div>
             <div class="brand">${result.brand}</div>
             </div>
            </div>
            <div class="right">
            <div class="price">$${result.price}</div>
            <div id="${resultID}" class="rating">
            ${renderStar(resultID,Math.round(result.rating))}
            </div>

           </div>
        </div>
        `)
        //When the image is loaded, apply it as a background image to the results thumbnail container. This is a recommendation to make use of CSS image scaling due to the API returning inconsistent image ratios
        thumbnailImage.onload = function () {
            console.log(`Ready with thumbnail as ${thumbnailImage}`)
            //Get the DOM element to apply the thumbail link to it using the results unique ID. The image has already been cached so calling it from the URL will be instant
            let thumbnailContainer = document.getElementById(`thumbnail${resultID}`)
            //Apply the thumbnail
            console.log(`Container ID ${thumbnailContainer.id}`)
            thumbnailContainer.style.backgroundImage = `url(${thumbnailImageLink})`
        }
    })

}
//END: Render Product Results



//BEGIN:Render Star
////Renders a star x amount of times 
function renderStar(container, stars) {
    console.log(`Ready to render ${stars} stars into ${container}`)
    setTimeout(() => {

        let thisContainer = document.getElementById(container)
        if (thisContainer) {
            thisContainer.innerHTML = ``
            for (var i = 0; i < stars; i++) {
                console.log(`Here's one`);
                thisContainer.insertAdjacentHTML('afterbegin', `<div class="star">
            <img src="assets/images/ratingStar.svg"/>
            </div>`)
            }
            gsap.to(`.rating`, {
                autoAlpha: 1,
                ease: Linear.easeNone,
                duration: 0.21
            })
        } else {}

    }, 355);

}
//END:Render Star

//BEGIN:View Product
////Views a product. Pass it the result ID
function viewProduct(resultID){

}
//END:View Product