const byId = id => {
  const e = document.getElementById(id);
  if (!e)
      console.log(`No element found with id: ${id}`);
  return e;
};

const setVisibility = (id, shouldShow) => {
  const displayStyle = shouldShow => shouldShow ? 'flex' : 'none';
  const visibilityStyle = shouldShow => shouldShow ? 'visible' : 'hidden';
  const e = byId(id);
  e.style.display = displayStyle(shouldShow);
  e.style.visibility = visibilityStyle(shouldShow);
  e.classList.remove('hidden');
}

const setValidationStatus = (e, isValid) => {
  if (isValid) 
    e.classList.remove("invalid-input");
  else 
    e.classList.add("invalid-input");
}

const baseInit = !window.onload ? () => {} : window.onload;
const pipe = (f1, f2) => { f1(); f2(); };
const addToOnLoad = (f) => window.onload = () => pipe(baseInit, f);

const getJson = (url) => 
    fetch(url)
        .then(r => {
            if (r.ok) 
                return r.json();
            else
                throw Error(`Request rejected with status ${res.status}`);
        });

const postJson = (url, data) =>
        fetch(url, {
                method: 'POST',
                body: JSON.stringify(data), 
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        .then(r => {
            if (r.ok) 
                return r.json();
            else
                throw Error(`Request rejected with status ${res.status}`);
        });
