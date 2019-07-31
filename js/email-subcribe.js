const byId = id => {
    const e = document.getElementById(id);
    if (!e)
        console.log(`No element found with id: ${id}`);
    return e;
};


const visibilityStyle = shouldShow => shouldShow ? 'flex' : 'none';
const setVisibility = (id, shouldShow) => byId(id).style.display = visibilityStyle(shouldShow);

const jsonIo = {
    storeBaseUrl: 'https://www.jsonstore.io',
    storeId: '6380571bd577406dfe41765b0c8d3b8cb6696338b988384cbda117ba589d5acc'
};
jsonIo.getStoreUrl = () => `${jsonIo.storeBaseUrl}/${jsonIo.storeId}`;
jsonIo.withSavedEntries = (callback) => {
    var req = new XMLHttpRequest();
    var url = jsonIo.getStoreUrl();

    req.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var resp = JSON.parse(this.responseText);
            callback(resp.result || [0]);
        }
    };
    req.open("GET", url, true);
    req.send();
};
jsonIo.appendEntry = (entries, entry) => {
    entries.push(entry);

    var req = new XMLHttpRequest();
    var url = jsonIo.getStoreUrl();
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 300) {
            } else {
                console.log('Submission failed');
            }
        }
    };
    req.open("POST", url, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(entries));
};

const localStorageEmailKey = 'email-subscription';
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const subscribe = (email) => {
    jsonIo.withSavedEntries(entries => {
        console.log({ email });
        console.log({ entries });
        jsonIo.appendEntry(entries, { subscribedAt: new Date().getTime(), email: email });
        localStorage.setItem("email-subscription", { email, subscribed: true });
        updateEmailVisibility();
    });
}

const updateEmailVisibility = () => {
    const hasEmailSubscribed = !!localStorage.getItem(localStorageEmailKey);
    setVisibility('email-signup', !hasEmailSubscribed);
    setVisibility('email-supporter', hasEmailSubscribed);
}

const init = () =>
{
    updateEmailVisibility();
    byId('submit-email').onclick = function(e) {
        e.preventDefault();

        const emailForm = byId('email-form');
        const emailInput = emailForm.elements["email-entry"];
        const email = emailInput.value;

        var emailIsValid = validateEmail(email);
        if (!emailIsValid) {
            emailInput.classList.add("invalid-input");
        } else {
            emailInput.classList.remove("invalid-input");
            subscribe(email);
        }
    };
};

window.onload = init(); 
