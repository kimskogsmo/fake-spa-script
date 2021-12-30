(fakeSpaNavigation = () => {
    function getClosestElement(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    }

    const parser = new DOMParser()
    let tags = document.querySelectorAll('a')

    function linkHandler (e) {
        e.preventDefault(true);
        e.stopPropagation();


        const next = fetch(e.target.href).then(body => {
            return body.text()
        })
            .then(bodyAsText => {
                const parsedBody = parser.parseFromString(bodyAsText, 'text/html');
                const nextMain = parsedBody.querySelector('main');
                const currMain = document.querySelector('main');

                const nextHead = parsedBody.querySelector('head');
                const currHead = document.querySelector('head');

                console.log(e.target);
                const nextUrl = new URL(e.target.href);
                const nextTitle = parsedBody.title;

                // Swap out HTML
                currMain.innerHTML = nextMain.innerHTML;
                currHead.innerHTML = nextHead.innerHTML;

                // Do the actual navigation
                window.history.pushState({}, nextTitle, nextUrl);

                // Animate to top
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Dont stack listeners
                e.target.removeEventListener('click', this);

                // Finally try to fetch all new links that should be present
                return () => fakeSpaNavigation();
            })

        // Done
    }

    if (tags.length) {
        tags.forEach(a => {
            a.addEventListener('click', linkHandler);
        })
    }
})()
