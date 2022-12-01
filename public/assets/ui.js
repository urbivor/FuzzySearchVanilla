//Counts
let searchResultsCount = 0;

//Data
let productResults = {}

//States
let noProductMatchesIndicatorState = `hidden`;
let productSearchQueryState = `waiting`;
let productSearchFailIndicatorState = `hidden`;

//Actors
let searchQueryInput = document.getElementById("searchQueryInput")
let productSearchNoResultsIndicator = document.getElementById("productSearchNoResultsIndicator")
let productSearchFailIndicator = document.getElementById("productSearchFailIndicator")
let productSearchResultsList = document.getElementById("productSearchResultsList")
let productViewTitle = document.getElementById("productViewTitle")
let productViewDescription = document.getElementById("productViewDescription")
let productViewRating = document.getElementById("productViewRating")
let productView = document.getElementById("productView")
let productViewImages = document.getElementById("productViewImages")
let productViewBuyButton = document.getElementById("productViewBuyButton")
let productViewInputOverlay = document.getElementById("productViewInputOverlay")
let productViewInputOverlayBackButton = document.getElementById("productViewInputOverlayBackButton")
let productViewInputOverlayBrand = document.getElementById("productViewInputOverlayBrand")
let productViewInputOverlayTitle = document.getElementById("productViewInputOverlayTitle")

//Listeners
searchQueryInput.addEventListener('input', (event) => {
    searchQueryWatcher()
});


productViewInputOverlayBackButton.addEventListener('click', (event) => {
    hideProductResult()
})
// searchQueryInput.addEventListener('keyup', (event) => {
//     searchQueryWatcher()
// });

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

    //Hide any visible ratings to re-enable fade-in
    gsap.to('.rating', {
        duration: 0.05,
        ease: Linear.easeNone
    })
    hideSearchResults(0.08)

    let searchQuery = searchQueryInput.value;
    let queryCharacterCount = searchQuery.length;
    if (queryCharacterCount > 0) {
        fetcher(`productSearch`, searchQuery)
    } else {
        hideSearchResults(0.05)
        hideNoProductMatchesIndicator();
    }

}
//END:Search Query Watcher


//BEGIN:Fetcher
////Interfaces with an API. Pass it the API name as the first parameter & additional parmaters thereafter
function fetcher(api, query) {

    //I'll just write one endpoint for this app, Product Search
    if (api == `productSearch`) {

        //Using Fetch we can do a very simple request like this & also built much more complex payloads with different content types
        fetch(`https://dummyjson.com/products/search?q=${query}`)
            //Assuming all goes well, convert the response to a JSON object
            .then((response) => response.json())
            //Then parse it using the Result Parser function
            .then((data) => resultsParser(data))
            //Handles errors. Interesting note, the dummyjson.com API went down for a while & this caught it 💪
            .catch((error) => {

                hideSearchResults(0.08)
                showProductSearchFailIndicator()
            });
    }
}
//END:Fetcher

//BEGIN:Results Parser
////Parses results after a search. Pass it a JSON object
function resultsParser(results) {
    //Hide the Product Search Fail Indicator if its visible

    productSearchFailIndicatorState == `visible` ? gsap.to(productSearchFailIndicator, {
        autoAlpha: 0
    }) : ""

    //The API returns a products subset which is all we need
    results = results.products
    //Reversing it as result appear more relevant
    results.reverse();
    //Count the results
    let resultsCount = results.length;

    //More than 0 results?
    if (resultsCount > 0) {

        //Set the results to the globally available data object productResults{}
        productResults = results;

        hideNoProductMatchesIndicator()
        renderProductResults(results);
        setTimeout(() => {
            showSearchResults(0.08)
        }, 355);
        //Handle no matches
    } else {

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

//BEGIN:Show The Product Search Fail Indicator
////Shows the no product search fail indicator
function showProductSearchFailIndicator() {
    gsap.to(productSearchFailIndicator, {
        autoAlpha: 1,
    })
    productSearchFailIndicatorState = `visible`
}
//END: Show Product Search Fail Indicator

//BEGIN:Hide Product Search Fail Indicator
////Hides the Product Search Fail Indicator
function hideProductSearchFailIndicator() {
    gsap.to(productSearchFailIndicator, {
        autoAlpha: 0,
    })
    productSearchFailIndicatorState = `hidden`
}
//END: Hides the Product Search Fail Indicator

//BEGIN:  Render Product Results
////Renders a list of product results
function renderProductResults(results) {

    productSearchResultsList.innerHTML = ``;
    results.forEach((result, index) => {
        //Creating a random throwaway 5 character ID to append to this result (Required to draw ratings stars & apply fade in to thumbnails)
        let resultID = Math.random().toString(36).slice(2, 7);
        //Getting the thumbnail image link for the result. The dummyjson.com/products API always sends the thumbnail as the last image
        let thumbnailImageLink = result.images.pop();

        //Creating the image as a javascript object, this is required to gracefully hide the loading indicator & allows to handle image load failures
        let thumbnailImage = new Image(0, 0);
        thumbnailImage.src = thumbnailImageLink;


        //Insert the result to the DOM
        productSearchResultsList.insertAdjacentHTML('afterbegin', `
        <div onclick=viewProductResult(this.getAttribute('data-index'),this) data-index=${index} class="result">
            <div class="left">
          
            <div id="thumbnail${resultID}" class="thumbnail";background-size:cover">
            <div class="microloader"></div>
            </div>
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

            //Get the DOM element to apply the thumbail link to it using the results unique ID. The image has already been cached so calling it from the URL will be instant
            let thumbnailContainer = document.getElementById(`thumbnail${resultID}`)

            //Wait for the ID to exist & apply the thumbnail

            if (thumbnailContainer) {
                //Apply the thumbnail

                thumbnailContainer.style.backgroundImage = `url(${thumbnailImageLink})`

                //Get the results microloader to fade it out once the image loads
                let microloader = thumbnailContainer.querySelector(`.microloader`)
                gsap.to(microloader, {
                    autoAlpha: 0,
                    duration: 0.21,
                    ease: Linear.easeNone
                })
            } else {}
        }
    })

}
//END: Render Product Results



//BEGIN:Render Star
////Renders a star x amount of times 
function renderStar(container, stars) {

    setTimeout(() => {

        let thisContainer = document.getElementById(container)
        if (thisContainer) {
            thisContainer.innerHTML = ``
            for (var i = 0; i < stars; i++) {
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



//BEGIN:View Product Result
////Views a matching product result.Pass it the index of the result you'd like as it exists in the global productResults object & the DOM result itself
function viewProductResult(index, thisResult) {
    //Scroll the window to the top in case a user selects an item from the bottom of a long list
    gsap.to(window, {
        scrollTo: 0,
        duration: 1.55,
        ease: Expo.easeOut
    })

    //Indicate which result has been selected
    gsap.to(thisResult, {
        background: `rgb(176, 178, 255)`,
        ease: Linear.easeNone,
        duration: 0.08,
    })
    //Slide out & hide the results
    gsap.to(productSearchResultsList, {
        x: -34,
        autoAlpha: 0.13,
        ease: Expo.easeOut,
        delay: 0.55
    })
    //Disable interactions on the results
    gsap.set(productSearchResultsList, {
        pointerEvents: `none`
    })

    //Render title & brand to the input overlay
    productViewInputOverlayBrand.innerText = productResults[index].brand;
    productViewInputOverlayTitle.innerText = productResults[index].title
    //Show the input overlay. Accepts a delay for timing
    showProductSearchInputOverlay(0.55)

    //Generate the product detail view
    productViewTitle.innerText = productResults[index].title
    productViewDescription.innerText = productResults[index].description
    productViewBrand.innerText = productResults[index].brand
    productViewBuyButton.innerHTML = `
    <div>Buy now</div>
    <div class="price">$${productResults[index].price}</div>
    `
    //Get any attached image links
    let images = productResults[index].images;
    let imagesLength = images.length;

    //If there images, run a loop through them to load & insert them into the product view
    if (imagesLength > 0) {
        images.forEach((image) => {
            //Generating a throwaway ID for the product for DOM targeting
            let productID = Math.random().toString(36).slice(2, 7);
            productViewImages.insertAdjacentHTML('afterbegin', `
            <div id="${productID}"  class="image">
            </div>
            `)

            //Download the images before fading them in

            let productImage = new Image(0, 0)
            productImage.src = image
            productImage.onload = function () {
                let productImage = document.getElementById(`${productID}`)
                productImage.style.backgroundImage = `url(${image})`
                gsap.to(productImage, {
                    duration: 0.21,
                    autoAlpha: 1,
                    ease: Linear.easeNone
                })
            }


        })
    } else {

    }

    //Make it draggable
    Draggable.create(productView, {
        type: "x",
        bounds: productView,
        edgeResistance: 0.89,
        onDragStart: function () {
            let startPosition = this.x;
            let direction = this.getDirection()
        },
        onDrag: function () {
            let deltaX = this.x;
            deltaX > 8 ? hideProductResult() & this.kill() : ""

        },
        onRelease: function () {
            gsap.to(productView, {
                x: 0,
                ease: Elastic.easeOut,
                duration: 1.34
            })
        }
    })

    //Reveal the product detail view
    gsap.to(productView, {
        duration: 0.55,
        ease: Expo.easeOut,
        autoAlpha: 1,
        x: 0,
        scale: 1,
        delay: 0.55
    })
}
//END:View Product Result

//BEGIN:Hide Product Result
////Hides the Product Result view. Pass it the Draggable instance
function hideProductResult() {
    //Hide the product result view
    gsap.to(productView, {
        autoAlpha: 0,
        ease: Expo.easeOut,
        duration: 0.55,
        onComplete: function () {

            gsap.set(productView, {
                x: 34
            })
            productViewImages.innerHTML = ``
        }
    })
    //Bring the results back
    gsap.to(productSearchResultsList, {
        x: 0,
        autoAlpha: 1,
        ease: Expo.easeOut,

    })

    //Re-enable interactions on the results
    gsap.set(productSearchResultsList, {
        pointerEvents: `all`
    })
    //Reset tap highlights
    gsap.to('.result', {
        background: `rgba(255,255,255)`,
        ease: Expo.easeOut,
        duration: 0.55
    })
    //Hide the input overlay
    gsap.to(productViewInputOverlay, {
        autoAlpha: 0,
        ease: Linear.easeNone,
        duration: 0.13
    })
}
//END:Hide Product Result

//BEGIN:Show Product Search Input Overlay
////Shows the product search input overlay when viewing a product/result. Pass it a delay in seconds
function showProductSearchInputOverlay(delay) {
    gsap.to(productViewInputOverlay, {
        autoAlpha: 1,
        ease: Linear.easeNone,
        duration: 0.13,
        delay: delay
    })
}
//END:Show Product Search Input Overlay

//BEGIN:Hide Product Search Input Overlay
////Hides the product search input overlay when viewing a product/result.Pass it a delay in seconds
function hideProductSearchInputOverlay(delay) {
    gsap.to(productViewInputOverlay, {
        autoAlpha: 0,
        ease: Linear.easeNone,
        duration: 0.13,
        delay: delay
    })
}
//END:Hide Product Search Input Overlay