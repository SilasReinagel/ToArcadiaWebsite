const isLoginDebug = false;
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
    return loginHash && loginHash.length > 36 && v % 31 == 0;
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
      new Song("Sylvius", "Onwards and Upwards", "To Arcadia", 
        "https://silasreinagel.sirv.com/LiteHtml5AudioPlayer/OnwardsAndUpwards.jpg", 
        ["https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/OnwardsAndUpwards-SuperEarlyBird.mp3"]),
      new Song("Sylvius", "Onwards and Upwards", "To Arcadia", 
        "https://silasreinagel.sirv.com/LiteHtml5AudioPlayer/OnwardsAndUpwards.jpg", 
      [ "https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/OnwardsAndUpwards-SuperEarlyBird.mp3"])
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
      credentials.put(loginHash);
    
    updateVisibility();
  };
}

const logout = () => { makeLoginIo().clear(); output('Logged out'); location.reload(); };

addToOnLoad(initEarlyLogin);
