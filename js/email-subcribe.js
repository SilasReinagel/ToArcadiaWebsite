const makeJsonIo = (slug) => ({    
    put: (item) => 
        getJson(`https://www.jsonstore.io/${slug}`)
            .then(obj => obj.result || [])
            .then(items => postJson(`https://www.jsonstore.io/${slug}`, items.concat([item])))
            .then(item => item)
});

const makeLocalStorageIo = (key) => ({
    put: (item) => new Promise(
        (resolve, reject) => {
            localStorage.setItem(key, item);
            resolve(item);
        })
});


const localStorageEmailKey = 'email-subscription';
const jsonIo = makeJsonIo('6380571bd577406dfe41765b0c8d3b8cb6696338b988384cbda117ba589d5acc');
const localStorageIo = makeLocalStorageIo(localStorageEmailKey);
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const updateEmailVisibility = () => {
    const hasEmailSubscribed = !!localStorage.getItem(localStorageEmailKey);        
    setVisibility('email-signup', !hasEmailSubscribed);
    setVisibility('email-supporter', hasEmailSubscribed);
    setVisibility('email', true);
};

const initEmailCustomEmailIfPresent = () => {
    if (!byId('submit-email'))
        return;

    const subscribe = (email) => 
        jsonIo
            .put({ subscribedAt: new Date().getTime(), email: email, subscribed: true })
            .then(item => localStorageIo.put(item))
            .then(_ => updateEmailVisibility())    
            .then(_ => onEmailSubcribe())
            .catch(_ => console.log('Subscription failed'));

    updateEmailVisibility();
    byId('submit-email').onclick = function(e) {
        e.preventDefault();

        const emailInput = byId('email-form').elements["email-entry"];
        const email = emailInput.value;
        const emailIsValid = validateEmail(email);
        setValidationStatus(emailInput, emailIsValid);
        if (emailIsValid) 
            subscribe(email);
    };
};

const initMailChimpEmailIfPresent = () => {
    if (!byId('mc-embedded-subscribe')) 
        return;

    const subscribe = (email) => 
        jsonIo
            .put({ subscribedAt: new Date().getTime(), email: email, subscribed: true })
            .then(item => localStorageIo.put(item))
            .then(_ => updateEmailVisibility())    
            .then(_ => onEmailSubcribe())
            .catch(_ => console.log('Subscription failed'));

    updateEmailVisibility();
    byId('mc-embedded-subscribe').onclick = function(e) {
        const emailInput = byId('mce-EMAIL');
        const email = emailInput.value;
        const emailIsValid = validateEmail(email);
        setValidationStatus(emailInput, emailIsValid);
        if (emailIsValid) 
            subscribe(email);
        else
            e.preventDefault();
    };
}

addToOnLoad(initEmailCustomEmailIfPresent);
addToOnLoad(initMailChimpEmailIfPresent);
