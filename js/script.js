/******************************************
 Treehouse Techdegree:
 FSJS project 2 - List Filter and Pagination
 ******************************************/
var studentsArray = [];
var pages = 0;
const itemsPerPage = 10;

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
    appendPageLinks(pages);
    showPage(studentsArray, 1);

    let anchors = document.querySelectorAll('li > a');
    for (let i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', function (event) {
            let activeLinks = document.getElementsByClassName("active");
            activeLinks[0].classList.remove('active');
            event.target.className += " active";

            showPage(studentsArray, anchors[i].id);
        });
    }
}

/***
 * Populated the selected page with the according list items
 * @param {Array} students
 * @param {Number} pageId
 */
function showPage(students, pageId) {
    let startIndex = 0, endIndex = 0;
    startIndex = (pageId - 1) * itemsPerPage;
    endIndex = pageId * itemsPerPage;
    if (endIndex > students.length) {
        endIndex = students.length;
    }

    let studentsListElem = document.querySelector('ul.student-list');
    studentsListElem.innerHTML = '';
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
        console.log(students[j]);
    }
}

/***
 * Created an HTML element with the given tag and styling classes
 * @param {String} tag
 * @param {Array} elemClass
 * @return HTMLElement
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
    //((studentsArrSize / itemsPerPage) % 1 === 0) ? (studentsArrSize / itemsPerPage) : Math.floor((studentsArrSize / itemsPerPage) + 1);
}

/***
 * Creates HTML anchor elements and adds them on the page
 * @param {Number} pages
 */
function appendPageLinks(pages) {
    let divElem = document.querySelector('div.pagination');
    let ulElem = document.createElement('ul');
    ulElem.className = 'ulAnchorList';
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
