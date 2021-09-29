(async () => {
    await functionCostom();
    await pusher();
    await logo();
    await title();
    await header();
    await pageHead();
    await mainNav();
    await footer();
    await constant();
    await nifty();
    await functionLockScreen();
})();

function logo() {
    return new Promise((resolve, reject) => {
        try {
            let element = document.querySelector('link[rel="shortcut icon"]') || document.createElement('link');
            element.rel = 'shortcut icon';
            element.href = `${location.origin}/source/img/logo.png`;
            element.type = 'image/x-icon';
            document.querySelector('head').appendChild(element);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

function title() {
    return new Promise((resolve, reject) => {
        try {
            document.querySelector('title').innerHTML = 'Standard Web | Nifty - Admin Template';
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

function header() {
    return new Promise(async (resolve, reject) => {
        await fetch(`${location.origin}/source/complement/header.html`, { method: 'GET' })
            .then(response => response.text()).then(data => {
                document.querySelector('header#navbar') ? resolve(document.querySelector('header#navbar').innerHTML = data) : resolve();
            }).catch((error) => reject(error));
    });
}

function pageHead() {
    return new Promise(async (resolve, reject) => {
        await fetch(`${location.origin}/source/complement/page-head.html`, { method: 'GET' })
            .then(response => response.text()).then(data => {
                document.querySelector('#page-head') ? resolve(document.querySelector('#page-head').innerHTML = data) : resolve();
            }).catch((error) => reject(error));
    });
}

function mainNav() {
    return new Promise(async (resolve, reject) => {
        await fetch(`${location.origin}/source/complement/main-nav.html`, { method: 'GET' })
            .then(response => response.text()).then(data => {
                document.querySelector('nav#mainnav-container') ? resolve(document.querySelector('nav#mainnav-container').innerHTML = data) : resolve();
            }).catch((error) => reject(error));
    });
}

function footer() {
    return new Promise(async (resolve, reject) => {
        await fetch(`${location.origin}/source/complement/footer.html`, { method: 'GET' })
            .then(response => response.text())
            .then(data => {
                if (!document.querySelector('footer#footer')) resolve();
                document.querySelector('footer#footer').innerHTML = data;
                document.querySelector('footer#footer > div > p').innerHTML = '&#0169; 2018 Your Company';
                resolve();
            }).catch((error) => reject(error));
    });
}

function constant() {
    return new Promise(resolve => {
        let script = document.createElement('script');
        script.src = `${location.origin}/config/web-constant.js`;
        document.querySelector('body').appendChild(script);
        resolve();
    });
}

function functionCostom() {
    return new Promise(resolve => {
        let script = document.createElement('script');
        script.src = `${location.origin}/source/js/function-custom.js`;
        document.querySelector('body').appendChild(script);
        resolve();
    });
}

function nifty(params) {
    return new Promise(resolve => {
        let element = document.createElement('script');
        element.src = `${location.origin}/source/plugins/nifty/nifty.min.js`;
        document.querySelector('body').appendChild(element);
        resolve();
    });
}

function pusher() {
    return new Promise(resolve => {
        let element = document.createElement('script');
        element.src = `https://js.pusher.com/4.1/pusher.min.js`;
        document.querySelector('body').appendChild(element);
        resolve();
    });
}

const functionLockScreen = function () {
    return new Promise(resolve => {
        let script = `   
        <div id="lockScreenBackground" style="opacity: 0; display: none;"></div>
        <div id="lockScreen" style="opacity: 0; display: none;" class="shadow">
          <h3 >Lock Screen</h3>
          <input placeholder="Username" id="u"  class="form-control" type="text" onkeypress="unlockKeyPress(event)"><br/>
          <input placeholder="Password" id="p" class="form-control" type="password" onkeypress="unlockKeyPress(event)"><br/>
          <button type="button" class="btn btn-primary btn-labeled" onclick="unlockScreen(); ">Unlock</button>
          <button type="button" class="btn btn-danger btn-labeled" onclick="logout(); ">Logout</button>
        </div>`;
        $("#container").append(script);
        resolve();
    });
}