let storage = document.getElementById('storage');

let START = 'a'.charCodeAt(0);
let STOP = 'j'.charCodeAt(0);

document.addEventListener('keydown', (e) => {
    if (storage.getAttribute('running_start') != 'false') return;
    if (storage.getAttribute('running_end') != 'false') return;
    if (e.code === "ArrowLeft") {
        storage.setAttribute('running_start', 'backwards');
        storage.setAttribute('running_end', 'backwards');
        backwards(storage.getAttribute('page'))
    }
    else if (e.code === 'ArrowRight') {
        storage.setAttribute('running_start', 'forwards');
        storage.setAttribute('running_end', 'forwards');
        forward(storage.getAttribute('page'))
    } else if (e.code === 'Space') {
        if (document.documentElement.style.getPropertyValue('--cursor') == 'default') {
            document.documentElement.style.setProperty('--cursor', 'none');
        } else {
            document.documentElement.style.setProperty('--cursor', 'default');
        }

    }
    console.log(e.code);
});

function oneTimeListener(node, type, callback) {
    // Create an Eventlistener which destroys itself at the first call
    node.addEventListener(type, function listener(e) {
        e.target.removeEventListener(e.type, listener);
        return callback.call(this, e);
    }, { once: true });
}

function nextPage(page) {
    let nextCharCode = page.charCodeAt(0) + 1;
    if (97 > nextCharCode > 90) nextCharCode = 97;
    if (nextCharCode > STOP) {
        storage.setAttribute('running_start', 'false');
        storage.setAttribute('running_end', 'false');
        return null
    };

    let nextChar = String.fromCharCode(nextCharCode);
    storage.setAttribute('page', nextChar)
    return document.getElementById(nextChar)
}

function beforePage(page) {
    let nextCharCode = page.charCodeAt(0) - 1;
    if (97 > nextCharCode > 90) nextCharCode = 90;
    if (START > nextCharCode) {
        storage.setAttribute('running_start', 'false');
        storage.setAttribute('running_end', 'false');
        return null
    };

    let nextChar = String.fromCharCode(nextCharCode);
    storage.setAttribute('page', nextChar);
    return document.getElementById(nextChar);
}


function forward(page) {
    let pagediv = document.getElementById(page);
    let next = nextPage(page);
    if (!next) return;
    pagediv.style.setProperty('--animation-state', 'running');
    next.style.setProperty('--animation-state', 'running');
    next.classList.remove('inactive');
    Array.from(pagediv.getElementsByClassName(page)).forEach((el) => {
        el.addEventListener('animationiteration', (e) => {
            if (storage.getAttribute('running_start') != 'forwards') return;
            if (storage.getAttribute('page') != next.id) return;
            if (!e.target.classList.contains('longest')) {
                e.target.style.setProperty('animation-play-state', 'paused');
                e.target.classList.add('paused');

                return;
            };
            pagediv.style.setProperty('--animation-state', 'paused');
            Array.from(next.getElementsByClassName('taked')).forEach((t) => {
                t.classList.replace('taked', 'was_taken')
            })
            if (!pagediv.contains(next)) {
                pagediv.classList.add('inactive')
            };
            storage.setAttribute('running_start', 'false');
            Array.from(document.getElementsByClassName('paused')).forEach((p) => {
                if (!p.classList.contains(pagediv.id)) return;
                p.style.setProperty('animation-play-state', 'var(--animation-state)');
                p.classList.remove('paused')
            })
        }, { once: true })
    })
    Array.from(next.getElementsByClassName(next.id)).forEach((el) => {
        el.addEventListener('animationiteration', (e) => {
            if (storage.getAttribute('running_end') != 'forwards') return;
            if (storage.getAttribute('page') != next.id) return;
            if (!e.target.classList.contains('longest')) {
                e.target.style.setProperty('animation-play-state', 'paused');
                e.target.classList.add('paused');
                return;
            };
            next.style.setProperty('--animation-state', 'paused');
            Array.from(document.getElementsByClassName(next.id)).forEach((r) => {
                r.style.setProperty('animation-name', getComputedStyle(r).animationName.replace('in', 'out'))
            })
            Array.from(document.getElementsByClassName('paused')).forEach((p) => {
                if (!p.classList.contains(next.id)) return;
                p.style.setProperty('animation-play-state', 'var(--animation-state)');
                p.classList.remove('paused')
            })
            storage.setAttribute('running_end', 'false');
        }, { once: true })
    })
}

function backwards(page) {
    // Beim Zurück und wieder Vorwärts werden ALLE Elemente gleichzeitig gestartet.
    // "animation-delay wird" nicht beachtet!
    // Die Animation wird nicht neugestartet, sondern nur nach einer Pausierung wieder gestartet.
    let pagediv = document.getElementById(page);
    let before = beforePage(page);
    if (!before) return;
    Array.from(pagediv.getElementsByClassName(page)).forEach((el) => {
        el.style.setProperty('animation-name', getComputedStyle(el).animationName.replace('out', 'in'))
        el.addEventListener('animationiteration', (e) => {
            if (storage.getAttribute('running_start') != 'backwards') return;
            if (storage.getAttribute('page') != before.id) return;
            if (!e.target.classList.contains('longest')) {
                e.target.style.setProperty('animation-play-state', 'paused');
                e.target.classList.add('paused');
                return;
            };
            pagediv.style.setProperty('--animation-state', 'paused');
            pagediv.style.setProperty('--direction', 'alternate');
            pagediv.classList.add('inactive');
            storage.setAttribute('running_start', 'false');
            Array.from(document.getElementsByClassName('paused')).forEach((p) => {
                if (!p.classList.contains(pagediv.id)) return;
                p.style.setProperty('animation-play-state', 'var(--animation-state)');
                p.classList.remove('paused')
            })
        }, { once: true })
    })
    Array.from(pagediv.getElementsByClassName('was_taken')).forEach((el) => {
        el.classList.replace('was_taken', 'taked')
    })
    pagediv.style.setProperty('--direction', 'alternate-reverse');
    before.style.setProperty('--direction', 'alternate-reverse');
    pagediv.style.setProperty('--animation-state', 'running');
    before.classList.remove('inactive');
    before.style.setProperty('--animation-state', 'running');

    Array.from(before.getElementsByClassName(before.id)).forEach((el) => {
        el.addEventListener('animationiteration', (e) => {
            if (storage.getAttribute('running_end') != 'backwards') return;
            if (storage.getAttribute('page') != before.id) return;
            if (!e.target.classList.contains('longest')) {
                e.target.style.setProperty('animation-play-state', 'paused');
                e.target.classList.add('paused');
                return;
            };
            before.style.setProperty('--animation-state', 'paused');
            Array.from(document.getElementsByClassName('paused')).forEach((p) => {
                if (!p.classList.contains(before.id)) return;
                p.style.setProperty('animation-play-state', 'var(--animation-state)');
                p.classList.remove('paused')
            })
            storage.setAttribute('running_end', 'false');
        })
    })
}