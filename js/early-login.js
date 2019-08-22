const isLoginDebug = true;
const output = (o) => { if (isLoginDebug) console.log(o)};
const makeLocalStorageIo = (key) => ({
  get: () => localStorage.getItem(key),
  put: (item) => new Promise(
      (resolve, reject) => {
          localStorage.setItem(key, item);
          resolve(item);
      }),
  clear: () => localStorage.removeItem(key)
});

const makeLoginIo = () => makeLocalStorageIo('early-login');

const initEarlyLogin = () =>
{
  let activated = false;
  const credentials = makeLoginIo();

  const val = (x) => (x || 'V')
    .split('')
    .map(l => l.charCodeAt(0))
    .reduce((p, c) => p + c);

  const isValid = (loginHash) => {
    const v = val(loginHash);
    output({ loginHash, v });
    const result = (loginHash || '').length > 36 && (v % 31 == 0);
    output({ result });
    return result;
  }

  const updateVisibility = () => {
      const isLoggedIn = isValid(credentials.get() || '');        
      setVisibility('login', !isLoggedIn);
      setVisibility('protected', isLoggedIn);
      if (isLoggedIn)
        activatePlayer();
  }

  const activatePlayer = () => {
    if (activated)
      return;

    activated = true;
    setVisibility('playlist', true);
    new AudioPlayer(new AudioSettings({ volume: 100, isLooping: false }), [
      new Song("Sylvius", "1 - Our Adventure Begins", "Here With Me", 
        "//images/here-with-me-cover-art.jpg", 
        ["https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/HereWithMeEP/01_Our_Adventure_Begins.mp3"]),
      new Song("Sylvius", "2 - Moment of Beauty", "Here With Me",  
        "//images/here-with-me-cover-art.jpg", 
        [ "https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/HereWithMeEP/02_Moment_of_Beauty.mp3"]),
        new Song("Sylvius", "3 - Here With Me", "Here With Me",  
          "//images/here-with-me-cover-art.jpg", 
          [ "https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/HereWithMeEP/03_Here_With_Me.mp3"]),
        new Song("Sylvius", "4 - Onwards and Upwards", "Here With Me",  
          "//images/here-with-me-cover-art.jpg", 
          [ "https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/HereWithMeEP/04_Onwards_and_Upwards.mp3"])
    ]);
  }

  updateVisibility();
  byId('login-button').onclick = function(e) {
    e.preventDefault();

    const username = byId('username').value;
    const password = byId('password').value;
    const loginHash = `${username}|${password}`;
    const loginSucceeded = isValid(loginHash);
    output({ loginSucceeded });
    // TODO: Feedback on bad login;
    if (loginSucceeded) 
    {
      credentials.put(loginHash)
        .then(_ => ga('send', { hitType: 'event', eventCategory: 'early-access-login', eventAction: 'succeeded', eventLabel: loginHash }));
    }
    else 
    {
      ga('send', { hitType: 'event', eventCategory: 'early-access-login', eventAction: 'failed', eventLabel: loginHash })
    }
    
    updateVisibility();
  };
}

const logout = () => { makeLoginIo().clear(); output('Logged out'); location.reload(); };

addToOnLoad(initEarlyLogin);
