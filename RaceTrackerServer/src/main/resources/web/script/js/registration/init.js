var checkboxName = "classCheckbox";
var eventKey = "";
var classesOfEvent = [];
var captchaSuccessCode = "";
//var port = "";
var port = ":8080";
//var host = "cloud.fpvracetracker.com";
var host = "localhost";
//var protocol = "https";
var protocol = "http";
var countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua & Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre & Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts & Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks & Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "USA", "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];
var path_getClassesOfEvent = "onlineRegister/classes/";
var path_registerPilotToEvent = "onlineRegister/registerPilot/";
function captchaSuccess(code) {
    captchaSuccessCode = code;
    document.getElementById('captcha').classList.remove('invalidCaptcha');
}
function captchaExpired() {
    captchaSuccessCode = "";
}
function getClassesFromCheckboxValues(chkboxName) {
    var checkboxes = document.getElementsByName(chkboxName);
    var checkboxesChecked = [];
    // loop over them all
    for (var i = 0; i < checkboxes.length; i++) {
        // And stick the checked ones onto an array...
        if (checkboxes[i].checked) {
            checkboxesChecked.push(checkboxes[i]);
        }
    }
    // Return the array if it is non-empty, or null
    if (checkboxesChecked.length < 1) {
        return [];
    }
    var values = [];
    checkboxesChecked.forEach(function (checkboxElement) {
        classesOfEvent.forEach(function (classOfEvent) {
            if (classOfEvent.uuid == checkboxElement.value) {
                values.push(classOfEvent);
            }
        });
    });
    return values;
}
function sendRequest(path, request, callback) {
    var http = new XMLHttpRequest();
    var url = protocol + "://" + host + "" + port + "/" + path;
    var body = JSON.stringify(request);
    if (!request) {
        http.open("GET", url, true);
    }
    else {
        http.open("POST", url, true);
    }
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //        http.setRequestHeader("auth", request.auth);
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            callback(JSON.parse(http.responseText));
        }
        else if (http.readyState == 4
            && (http.status == 0 || http.status > 500)) {
            console.log("error: ", http);
            callback({
                status: "ERROR"
            });
        }
    };
    http.send(body);
}
function validateEmail(email) {
    var re = /^.+@.+\..+$/;
    return re.test(email);
}
document
    .addEventListener("DOMContentLoaded", function () {
    var select = document.getElementById("select_country");
    for (var i = 0; i < countries.length; i++) {
        var opt = document.createElement('option');
        opt.innerHTML = countries[i];
        select.appendChild(opt);
    }
    window.location.search.replace('?', '').split("&").forEach(function (param) {
        var param = param.split("=");
        if (param && param.length == 2) {
            if (param[0] == "key") {
                eventKey = param[1];
                sendRequest(path_getClassesOfEvent + "" + eventKey, null, function (classes) {
                    if (!classes || classes.length < 1) {
                        document.getElementById('registerForm').classList.add("hidden");
                        document.getElementById('registerNotPossible').classList.remove("hidden");
                    }
                    classesOfEvent = classes;
                    var index = 0;
                    classes.forEach(function (clazz) {
                        if (!clazz.deleted) {
                            var checkboxHtml = "<input id='classCheckbox" + index + "' type='checkbox' name='" + checkboxName + "' value='" + clazz.uuid + "'><label for='classCheckbox" + index + "'>" + clazz.name + "</label> <br>";
                            document.getElementById("classContainer").insertAdjacentHTML('beforeend', checkboxHtml);
                            index++;
                        }
                    });
                });
            }
        }
    });
    document.getElementById("registerButton").addEventListener("click", function () {
        document.getElementById('classContainer').classList.remove('invalid');
        document.getElementById('input_firstName').classList.remove('invalid');
        document.getElementById('input_lastName').classList.remove('invalid');
        document.getElementById('input_email').classList.remove('invalid');
        document.getElementById('captcha').classList.remove('invalidCaptcha');
        var classObjects = getClassesFromCheckboxValues(checkboxName);
        var firstName = document.getElementById('input_firstName').value;
        var lastName = document.getElementById('input_lastName').value;
        var email = document.getElementById('input_email').value;
        var error = false;
        if (classObjects.length < 1) {
            document.getElementById('classContainer').classList.add('invalid');
            error = true;
        }
        if (!firstName || firstName.length < 2) {
            document.getElementById('input_firstName').classList.add('invalid');
            error = true;
        }
        if (!lastName || lastName.length < 2) {
            document.getElementById('input_lastName').classList.add('invalid');
            error = true;
        }
        if (!validateEmail(email)) {
            document.getElementById('input_email').classList.add('invalid');
            error = true;
        }
        if (!captchaSuccessCode) {
            document.getElementById('captcha').classList.add('invalidCaptcha');
            error = true;
        }
        if (error) {
            return;
        }
        document.getElementById("registerButton").classList.add("disabled");
        var registrationObject = {
            firstName: firstName,
            lastName: lastName,
            alias: document.getElementById('input_alias').value,
            phone: document.getElementById('input_phone').value,
            country: document.getElementById('select_country').options[document.getElementById('select_country').selectedIndex].value,
            email: email,
            club: document.getElementById('input_club').value,
            deviceId: document.getElementById('input_transponderId').value,
            classes: classObjects
        };
        sendRequest(path_registerPilotToEvent + "" + eventKey + "/" + captchaSuccessCode, registrationObject, function (response) {
            console.log(response);
            if (response.status == "success") {
                document.getElementById('registerForm').classList.add("hidden");
                document.getElementById('registerSuccess').classList.remove("hidden");
            }
            try {
                delete registrationObject.classes;
                window.top.pilotRegistered(registrationObject);
            }
            catch (ex) {
                console.log("could not call parrent function window.top.pilotRegistered(registrationObject);");
            }
            document.getElementById("registerButton").classList.remove("disabled");
        });
    });
}, false);
