/******************************************
 Treehouse Techdegree:
 FSJS project 2 - List Filter and Pagination
 ******************************************/
var studentsArray = [];
var pages = 0;
const itemsPerPage = 10;
const HTTP_200 = 200;

/***
 * Loads the local JSON file with the students' info
 * @param {String} path
 * @param {function} success
 * @param {function} error
 */
function loadJSON(path, success, error) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        //if the error handler is not provided
        if (error === null) {
            console.warn("error not specified; reverting to console");
            error = console.error;
        }
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === HTTP_200) {
                //in case we have incorrect JSON format, we need to catch the error
                try {
                    let responseInJson = JSON.parse(xhr.responseText);
                    success(responseInJson);
                } catch (e) {
                    error(e);
                }
            } else {
                error(xhr.status);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

loadJSON('students.json',
    function (data) {
        initializeData(data);
    },
    function (message) {
        alert(message);
    });

/***
 * Initializes the global variables, studentsArray and pages; populates the 1st page with list items; sets the 'active' class to the selected link
 * @param {Array} data
 */
function initializeData(data) {
    studentsArray = data;
    pages = calculatePages(studentsArray.length);
    addSearchTextField();
    appendPageLinks(pages);
    showPage(studentsArray, 1);
    addPageSwitchEvents(studentsArray);
}

/***
* Listens for the events that occur on page switch (anchor click)
* @param {Array} studentsArray
*/
function addPageSwitchEvents(studentsArray){
    let anchors = document.querySelectorAll('li > a');
    for (let i = 0; i < anchors.length; i++) {
        let anchor = anchors[i];
        anchor.addEventListener('click', pageSwitchEventHandler);
    }
}

/***
 * Event handler for the page switch event. Removes the class `active` from the previous page and adds it to the selected one
 * It calls the function responsible for displaying the content on the page
 * @param {Event} event
 */
function pageSwitchEventHandler(event) {
    let activeLinks = document.getElementsByClassName("active");
    let selectedAnchor = event.target;
    activeLinks[0].classList.remove('active');
    selectedAnchor.className += " active";
    showPage(studentsArray, parseInt(selectedAnchor.id));
}

/***
 * Populates the selected page with the respective list items
 * @param {Array} students
 * @param {Number} pageId
 */
function showPage(students, pageId) {
    let divPage = document.querySelector('div.page');
    let studentsListElem = document.querySelector('ul.student-list');
    //Clear the existing results
    studentsListElem.innerHTML = '';
    let divNoResultsElem =  document.querySelector('div.js-no-results');

    if(students.length === 0){
        if (!divNoResultsElem) {
            createNoResultsSection(divPage);
        }
    } else {
        if(divNoResultsElem) {
            divPage.removeChild(divNoResultsElem);
        }
        createResultsSection(pageId, students, studentsListElem);
    }
}

/***
 * Creates the HTML section of the page for no results found
 * @param {HTMLDivElement} divPage
 */
function createNoResultsSection(divPage){
    let headerNoResults = document.createElement('h2');
    headerNoResults.className = 'h2-no-results';
    headerNoResults.innerHTML = "No results found";
    let divNoResults = document.createElement('div');
    divNoResults.classList.add('js-no-results');
    divNoResults.appendChild(headerNoResults);
    let divPaginationElem = document.querySelector('div.pagination');
    divPage.insertBefore(divNoResults, divPaginationElem);
}

/***
 * Creates the HTML section which holds the li items with the students' info.
 * Calculates the items of the array that should be displayed on the selected page
 * @param {Number} pageId The 1-based index of the page to be displayed
 * @param {Array} students An array of all the students including those that might not be displayed because of pagination
 * @param {HTMLUListElement} studentsListElem The parent element hosting the student li entries
 */
function createResultsSection(pageId, students, studentsListElem) {
    let startIndex = 0, endIndex = 0;
    startIndex = (pageId - 1) * itemsPerPage;
    endIndex = pageId * itemsPerPage;
    if (endIndex > students.length) {
        endIndex = students.length;
    }

    for (let j = startIndex; j < endIndex; j++) {
        let li = createElement('li', ['student-item', 'cf']);
        let divStudentDetails = createElement('div', ['student-details']);
        let imageAvatar = createElement('img', ['avatar']);
        let nameHeader = createElement('h3', []);
        let emailSpan = createElement('span', ['email']);
        let divJoinedDetails = createElement('div', ['joined-details']);
        let dateSpan = createElement('span', ['date']);

        li.appendChild(divStudentDetails);
        li.appendChild(divJoinedDetails);

        divStudentDetails.appendChild(imageAvatar);
        divStudentDetails.appendChild(nameHeader);
        divStudentDetails.appendChild(emailSpan);

        divJoinedDetails.appendChild(dateSpan);

        imageAvatar.src = students[j].src;
        nameHeader.innerHTML = students[j].name;
        emailSpan.innerHTML = students[j].email;
        dateSpan.innerHTML = students[j].joinedDetails;

        studentsListElem.appendChild(li);
    }
}

/***
 * Creates an HTML element with the given tag and styling classes
 * @param {String} tag
 * @param {Array} elemClass
 * @return {HTMLElement}
 */
function createElement(tag, elemClass) {
    let elem = document.createElement(tag);
    for (let i = 0; i < elemClass.length; i++) {
        elem.classList.add(elemClass[i]);
    }

    return elem;
}

/***
 * Calculates the number of pages used to display the content
 * @param {Number} studentsArrSize
 * @return Number
 */
function calculatePages(studentsArrSize) {
    return Math.ceil(studentsArrSize / itemsPerPage);
}

/***
 * Creates HTML anchor elements and adds them on the page
 * @param {Number} pages
 */
function appendPageLinks(pages) {
    let divElem = document.querySelector('div.pagination');
    divElem.innerHTML = '';
    let ulElem = document.createElement('ul');
    ulElem.className = 'js-ul-anchor-list';
    divElem.appendChild(ulElem);

    for (let i = 1; i <= pages; i++) {
        let li = document.createElement('li');
        let anchor = document.createElement('a');
        if (i === 1) {
            anchor.className = 'active';
        }
        anchor.id = i;
        anchor.href = "#";
        anchor.innerHTML = i;
        li.appendChild(anchor);

        ulElem.appendChild(li);
    }
}

/***
 * Creates the search input text field and the button, used for filtering the students
 * Listens for the events when the button is clicked and an input is made from the keyboard
 */
function addSearchTextField(){
    let divStudentSearch = document.querySelector('div.student-search');
    let inputElem = document.createElement('input');
    inputElem.type = "text";
    inputElem.placeholder = "Search for students...";
    inputElem.id = "js-search-field";
    let searchButton = document.createElement('button');
    searchButton.innerHTML = "Search";
    searchButton.className = "js-search-button";

    divStudentSearch.appendChild(inputElem);
    divStudentSearch.appendChild(searchButton);

    inputElem.addEventListener('keyup', handleKeyUp);
    searchButton.addEventListener('click', handleClick);
}

/***
 * Event handler for the key up event. Takes the content from the input element and performs the filtering against it
 * @param {Event} event
 */
function handleKeyUp(event){
    let term = event.target.value;
    searchTerm(term);
}

/***
 * Event handler for the click event. Takes the3
 * content from the input element and performs the filtering against it
 */
function handleClick(){
    let term = document.querySelector('input#js-search-field').value;
    searchTerm(term);
}

/***
 * Filters the students with the given search term and updates the DOM with the results. The first page is selected.
 * Filtering is plain text and NOT case sensitive.
 * @param {String} searchTerm
 */
function searchTerm(searchTerm){
    searchTerm = searchTerm.toLowerCase();
    let searchResults = [];
    studentsArray.forEach(student => {
        let studentName = student.name.toLowerCase();
        if(studentName.indexOf(searchTerm) > -1){
            searchResults.push(student);
        }
    });

    let searchResultPages = calculatePages(searchResults.length);
    appendPageLinks(searchResultPages);
    showPage(searchResults, 1);
    addPageSwitchEvents(searchResults);
}
