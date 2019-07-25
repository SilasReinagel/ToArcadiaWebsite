
window.onload = function ()
{

    document.getElementById('submit-email').onclick = function(e) {
        var emailForm = document.getElementById('email-form');
        var email = emailForm.elements["email-entry"].value;

        if (validateEmail(email)) {
            emailForm.style.display = 'none';
            document.getElementById('email-submitted').style.display = 'inline';
        } else {
            document.getElementById("email-entry").classList.add("invalid-input");
        }
        e.preventDefault();
    };

    function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
};

