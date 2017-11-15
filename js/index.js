
(function (global) {
    var PhoneBook = function () {
        return new PhoneBook.init();
    };

    PhoneBook.prototype = {

        //default functions
        data: [
            //add data here
        ],
        pageContacts: [],
        searchResults: [],
        add: function (name, phone, email) {
            //add Contact
            this.data.push({
                name: name,
                phone: phone,
                email: email
            });
            //save to local storage
            contactList.save(this.data);
            return this;
        },
        remove: function(index) {

            //remove Contact
            this.data.splice(index,1);
            contactList.save(this.data);
            //reload array
            showAllContacts();


            return this;
        },
        search: function (searchTerm) {
            if (this.data.length) {
                // this.searchResults=[];
                this.searchResults = this.data.filter((contact)=>{
                    let indicator = false;
                    if (contact.name.toLowerCase() == searchTerm.toLowerCase()) {
                        indicator = true;
                    }
                    if (contact.phone.toLowerCase() == searchTerm.toLowerCase()) {
                        indicator = true;
                    }
                    return indicator;
                });

                return this.searchResults;
            } else {
                console.log("There are no results");
            }
            return this;
        },
        list: function(conPerPage , pagenum) {
            if (this.data.length) {
                this.pageContacts=[];
                var startIndex =Number(conPerPage)  * Number(pagenum);

                var endIndex = startIndex + Number(conPerPage) ;

                if( endIndex > this.data.length){
                    endIndex = this.data.length;
                }
                for (var i = startIndex ; i < endIndex; i++) {
                    this.pageContacts.push(this.data[i]);
                }
                //sort array based on name
                this.pageContacts.sort(function(a, b) {
                    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                });
                return this.pageContacts;
            } else {
                console.log("There are no data");
            }
            return this.data;
        },
        getAll: function() {
            if (this.data.length) {
                return this.data;
            } else {
                console.log("There are no data");
            }
            return this.data;
        },
        save: function (data) {
            //save to local storage. This isn't hugely necessary
            localStorage.setItem('data', JSON.stringify(data));
        }
    }
    PhoneBook.init = function () {
        let data = localStorage.getItem('data');
        if(data){
            this.data = JSON.parse(localStorage.getItem('data'));

            return;
        }
        this.data = [];
    }

    PhoneBook.init.prototype = PhoneBook.prototype;
    global.PhoneBook = $pb = PhoneBook;

})(window);

if (!window.contactList) { //check if we already have a contact list
    window.contactList = $pb();
}

var tabs = document.getElementsByClassName('tab');
var topTabs = document.getElementsByClassName('tab-item');
var inputs = document.getElementsByClassName('input');

//add new contact form submitted
var form = document.getElementById('contact');
form.addEventListener('submit', function () {

    //check name validation
    if(!validateName(form.name.value)) {
        inputs[0].className = 'input selected';
        inputs[1].className = 'input';
        inputs[2].className = 'input';
        alert("Name is not valid available a-zA-Z0-9 and space maxCharacters = 100 ");
    }
    //check phone validation
    else if(!validateNumber(form.phone.value)){
        inputs[0].className = 'input';
        inputs[1].className = 'input selected';
        inputs[2].className = 'input';
        alert("Phone is not valid phone format '12-345-6789' ");
    }
    //check email validation
    else if(!validateEmail(form.email.value)){
        inputs[0].className = 'input';
        inputs[1].className = 'input';
        inputs[2].className = 'input selected';
        alert("Email is not valid  email format 'ahmed@example.com' ");
    }
    //all validation passed go push contact
    else{
        contactList.add(form.name.value, form.phone.value, form.email.value);
        inputs[0].className = 'input';
        inputs[1].className = 'input';
        inputs[2].className = 'input';
        alert("Contact has been added successfully");
    }
    event.preventDefault();
});

//Search form submitted
var searchForm = document.getElementById('searchForm');
searchForm.addEventListener('submit', function () {
    var results = contactList.search(searchForm.searchInput.value);;

    document.getElementById('results').innerHTML = '';

    if (results.length > 0) {
        for (var i = 0; i < results.length; i++) {
            document.getElementById('noSearchResults').style.display = 'none';
            document.getElementById('results-table').style.display = 'block';
            document.getElementById('results').innerHTML +=
                '<tr class="contact-item"><td>' + results[i].name +
                '</td><td>' + results[i].phone +
                '</td><td>' + results[i].email + '</td></tr>';
        }
    } else {
        //show message no results
        document.getElementById('noSearchResults').style.display = 'block';
        document.getElementById('results-table').style.display = 'none';
    }

    event.preventDefault();
});

//show contacts per page form submitted
var showContactsForm = document.getElementById('showContactsForm');
showContactsForm.addEventListener('submit', function () {
    if (window.contactList) { //check if we already have a contact list
        document.getElementById('list-tab-results').innerHTML = '';
        var contacts = contactList.list(showContactsForm.conPerPage.value , showContactsForm.page.value);//get the first twenty contacts
        if (contacts.length > 0) {
            document.getElementById('list-tab-noContacts').style.display = 'none';
            document.getElementById('list-tab-grid').style.display = 'block';
            for (var i = 0; i < contacts.length; i++) {
                document.getElementById('list-tab-results').innerHTML +=
                   '<tr class="contact-item">'+
                    '<td>' + contacts[i].name +
                    '</td><td>' + contacts[i].phone +
                    '</td><td>' + contacts[i].email +
                    '</td></tr>';
            }
        } else {
            document.getElementById('list-tab-noContacts').style.display = 'block';
            document.getElementById('list-tab-grid').style.display = 'none';
        }
    }
    event.preventDefault();
});

function showAllContacts(){
    if (window.contactList) { //check if we already have a contact list
        document.getElementById('show-all-tab-results').innerHTML = '';
        var contacts = contactList.getAll();//get the first twenty contacts
        if (contacts.length > 0) {
            document.getElementById('show-all-tab-noContacts').style.display = 'none';
            document.getElementById('show-all-tab-grid').style.display = 'block';
            for (var i = 0; i < contacts.length; i++) {
                document.getElementById('show-all-tab-results').innerHTML +=
                    '<tr class="contact-item"><td>'+ i +
                    '</td><td>' + contacts[i].name +
                    '</td><td>' + contacts[i].phone +
                    '</td><td>' + contacts[i].email +
                    '</td><td> <input type="button" value="Delete" class="delete-btn" onclick="deleteContact('+i+')" > </td></tr>';
            }
        } else {
            document.getElementById('show-all-tab-noContacts').style.display = 'block';
            document.getElementById('show-all-tab-grid').style.display = 'none';
        }
    }
    event.preventDefault();
}

//toggle active tab and show and hide content for tab
function toggleActiveTab(sel){
    for(var i=0 ; i<4 ; i++ ){
        tabs[i].className = 'tab';
        topTabs[i].className = 'tab-item';
    }
    tabs[sel].className ='tab active';
    topTabs[sel].className ='tab-item active';
    if(sel==3){
        //if remove contact tab clicked load all contacts
        showAllContacts()
    }

}

// validation for name
function validateName(name) {
    var nameRegex = /^[a-zA-Z0-9 ,.'-]+$/i;
    return nameRegex.test(name);
}

// validation for phone number
function validateNumber(phone) {
    var phoneRegex = /^\d{2}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
}

// validation for Email
function validateEmail(email) {
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
}

//delete btn clicked
function deleteContact(index) {
    contactList.remove(index);
}

