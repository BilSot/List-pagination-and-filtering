/******************************************
 Treehouse Techdegree:
 FSJS project 2 - List Filter and Pagination
 ******************************************/
var studentsArray = [];
var pages = 0;
const itemsPerPage = 10;
const selfObj = this;
/***
 * Loads the local JSON file with the students' info
 * @param {String} path
 * @param {function} success
 * @param {function} error
 */
function loadJSON(path, success, error) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                success(JSON.parse(xhr.responseText));
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
    function (status) {
        console.error(status);
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
    highLightActiveAnchor(studentsArray);
}

/***
* Initializes the global variables, studentsArray and pages; populates the 1st page with list items; sets the 'active' class to the selected link
* @param {Array} studentsArray
*/
function highLightActiveAnchor(studentsArray){
    let anchors = document.querySelectorAll('li > a');
    for (let i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', function (event) {
            let activeLinks = document.getElementsByClassName("active");
            activeLinks[0].classList.remove('active');
            event.target.className += " active";

            showPage(studentsArray, parseInt(anchors[i].id));
        });
    }
}

/***
 * Populated the selected page with the according list items
 * @param {Array} students
 * @param {Number} pageId
 */
function showPage(students, pageId) {
    let divPage = document.querySelector('div.page');
    let studentsListElem = document.querySelector('ul.student-list');
    studentsListElem.innerHTML = '';
    let divNoResultsElem =  document.querySelector('div.js-no-results');

    if(students.length === 0){
        if (!divNoResultsElem) {
            createNoResultsSection(divPage);
        }
        return;
    }else {
        if(divNoResultsElem) {
            divPage.removeChild(divNoResultsElem);
        }
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
            //console.log(students[j]);
        }
    }
}

/***
 * Creates the HTML section of the page for no results found
 * @param {HTMLElement} divPage
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
 * Created an HTML element with the given tag and styling classes
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
        if (i == 1) {
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
 * Creates the input text field and the button, used for searching(filtering) the students
 * Handles the events on key up, for the input, and click, for the button
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

    inputElem.addEventListener('keyup', triggerKeyUp);
    searchButton.addEventListener('click', triggerClick);
}

/***
 * Event handler for the key up event
 * @param {Object} inputElem
 */
function triggerKeyUp(inputElem){
    let searchTerm = inputElem.target.value.toLowerCase();
    selfObj.searchTerm(searchTerm);
}

/***
 * Event handler for the click event
 */
function triggerClick(){
    let searchTerm = document.querySelector('input#js-search-field').value.toLowerCase();
    selfObj.searchTerm(searchTerm);
}

/***
 * Filters the students with the given search term and stores the results in a new array
 * @param {String} searchTerm
 */
function searchTerm(searchTerm){
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
    highLightActiveAnchor(searchResults);
}
