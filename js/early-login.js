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
      new Song("Sylvius", "Through The Dark", "To Arcadia", 
        "/images/album-title.jpg", 
        ["https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/ToArcadia/ThroughTheDark.mp3"]),
      new Song("Sylvius", "The Stars Beckon", "To Arcadia",  
        "/images/album-title.jpg", 
        ["https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/ToArcadia/TheStarsBeckon.mp3"]),
      new Song("Sylvius", "Our Adventure Begins", "To Arcadia", 
        "/images/album-title.jpg", 
        ["https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/ToArcadia/OurAdventureBegins.mp3"]),
      new Song("Sylvius", "The Fox and the Frog", "To Arcadia", 
        "/images/album-title.jpg", 
        ["https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/ToArcadia/TheFoxAndTheFrog.mp3"]),
      new Song("Sylvius", "Icicle Cavern", "To Arcadia", 
        "/images/album-title.jpg", 
        ["https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/ToArcadia/IcicleCavern.mp3"]),
      new Song("Sylvius", "Hillside by the Lake", "To Arcadia", 
        "/images/album-title.jpg", 
        ["https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/ToArcadia/HillsideByTheLake.mp3"]),
      new Song("Sylvius", "Onwards and Upwards", "To Arcadia",  
        "/images/album-title.jpg", 
        ["https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/ToArcadia/OnwardsAndUpwards.mp3"]),
      new Song("Sylvius", "Moment of Beauty", "To Arcadia", 
        "/images/album-title.jpg", 
        ["https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/ToArcadia/MomentOfBeauty.mp3"]),
      new Song("Sylvius", "Triumph", "To Arcadia", 
        "/images/album-title.jpg", 
        ["https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/ToArcadia/Triumph.mp3"]),
      new Song("Sylvius", "Arcadia At Last", "To Arcadia", 
        "/images/album-title.jpg", 
        ["https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/ToArcadia/ArcadiaAtLast.mp3"]),
      new Song("Sylvius", "Under the Night Sky", "To Arcadia", 
        "/images/album-title.jpg", 
        ["https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/ToArcadia/UnderTheNightSky.mp3"]),    
      new Song("Sylvius", "Springtime Dance", "To Arcadia", 
        "/images/album-title.jpg", 
        ["https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/ToArcadia/SpringtimeDance.mp3"]),
      new Song("Sylvius", "Here With Me", "To Arcadia",  
        "/images/album-title.jpg", 
        ["https://sylvius-piano-songs.s3-us-west-1.amazonaws.com/ToArcadia/HereWithMe.mp3"]),
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
