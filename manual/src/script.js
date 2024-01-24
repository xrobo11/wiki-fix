const sort_ascending = (a, b) => {
    if (a.offsetTop > b.offsetTop) {
        return 1;
    }
    if (a.offsetTop < b.offsetTop) {
        return -1;
    }
    return 0;
}


// TOC 항목 설정

function getNavbarHeight() {
    const navbar = document.querySelector('.navbar');
    return navbar.offsetHeight;;
}

function getTocList() {
    const hs = document.getElementsByClassName("chapter");
    const hAll = [...hs];

    hAll.sort(sort_ascending)

    const toc = document.getElementById("toc");
    for (h of hAll) {
        const newElement = document.createElement("li");
        newElement.classList.add("level-" + h.tagName);
        newElement.innerText = h.innerText;
        toc.appendChild(newElement);
    }
}

function setContentPosition(targetElement) {
    const hAll = document.getElementsByClassName("chapter")
    for (let h of hAll) {
        if (h.innerText === targetElement.innerText) {
            const height = getNavbarHeight();
            window.scrollTo({  top: h.offsetTop, behavior: "smooth" });
            return true;
        }
    }

    return false;
}








// TOC toggle 설정

function toggleToc() {
    const toc = document.getElementById('toc');
    toc.classList.toggle('active');
    
    lastKwownScrollElement = findTopElementPosition(window.scrollY);
    if (toc.classList.contains('active')) {
        openToc();
    } else{
        closeToc();
    }
    window.scrollTo({top:lastKwownScrollElement.offsetTop});
}

function openToc() {
    const toc = document.getElementById('toc');
    if (!toc.classList.contains('active')) {
        toc.classList.toggle('active');
    }
    setTocOpenView();
}

function closeToc() {
    const toc = document.getElementById('toc');
    if (toc.classList.contains('active')) {
        toc.classList.toggle('active');
    }
    setTocCloseView();
}

function setTocOpenView() {
    const toc = document.getElementById('toc');
    const tocWidth = toc.offsetWidth;

    const tocOpen = document.getElementById('toc-open');
    tocOpen.innerText = '닫기'

    const contentBody = document.querySelector('.markdown-body');
    contentBody.style.left = tocWidth + 'px';
    const contentBodyWidth = (document.documentElement.clientWidth - tocWidth) + 'px';
    contentBody.style.width = contentBodyWidth;
}

function setTocCloseView() {
    const toc = document.getElementById('toc');

    const tocOpen = document.getElementById('toc-open');
    tocOpen.innerText = '목차'

    const contentBody = document.querySelector('.markdown-body');
    contentBody.style.left = 0 + 'px';
    const contentBodyWidth = (document.documentElement.clientWidth) + 'px';
    contentBody.style.width = contentBodyWidth;
}


function setTocAndBodyHeight() {
    const toc = document.getElementById('toc');
    const contentBody = document.querySelector('.markdown-body');

    const height = getNavbarHeight();
    toc.style.top = height + 'px';
    toc.style.height = (window.innerHeight - height) + 'px';
    contentBody.style.top = (height + 20) + 'px';
}

function setTocView() {
    const toc = document.getElementById('toc');
    const contentBody = document.querySelector('.markdown-body');
    
    const height = getNavbarHeight();
    toc.style.top = height + 'px';
    toc.style.height = (window.innerHeight - height) + 'px';
    contentBody.style.top = (height + 20) + 'px';

    const clientWidth = document.documentElement.clientWidth;
    if (clientWidth > 700) {
        openToc();
    } else {
        closeToc();
    }
}






// Scroll 시 content body 위치 설정

function findTopElementPosition(stdElementOffsettop) {
    let clientTopElement = undefined;
    const hs = document.getElementsByClassName('chapter');
    const p = document.getElementsByTagName("p");
    const div = document.getElementsByTagName("div");
    const hAll = [...hs, ...p, ...div];
    hAll.sort(sort_ascending)

    for (let elem of hAll) {
        if (elem.offsetTop <= stdElementOffsettop) {
            clientTopElement = elem;
        }
    }
    return clientTopElement;
}

function findTargetElement(startPos, scrollPos, elements) {
    let clientTopElement = undefined;
    for (let elem of elements) {
        if (startPos <= elem.offsetTop && elem.offsetTop <= scrollPos) {
            clientTopElement = elem;
        }
    }
    return clientTopElement;
}

function setTocNowView(scrollPos) {
    let text = "";
    let startPos = 0;

    let hns = document.getElementsByTagName("h2");
    if (hns) {
        hns = findTargetElement(startPos, scrollPos, hns);
        if (hns) {
            text += hns.innerText;
            startPos = hns.offsetTop;
        }
    }

    const tagNames = ["h3", "h4"]
    for (let tagName of tagNames) {
        hns = document.getElementsByTagName(tagName);
        if (hns) {
            const topHns = findTargetElement(startPos, scrollPos, hns);
            if (topHns) {
                text += ` > ${topHns.innerText}`;
                startPos = topHns.offsetTop;

            } else {
                break;
            }
        }
    }

    const tocNow = document.getElementById("toc-now");
    tocNow.innerText = text;
}





let lastKnownScrollPosition = 0;
let lastKwownScrollElement = undefined;
let ticking = false;



// toc list 만들고, list element click event

getTocList();





// toggle event

const tocOpenElement = document.getElementById('toc-open');
const tocCloseElement = document.getElementById('toc-close');

tocOpenElement.onclick = toggleToc;
tocCloseElement.onclick = toggleToc;

setTocView();

window.addEventListener('resize', function() {
    setTocView();
    window.scrollTo({top:lastKwownScrollElement.offsetTop});
});

window.addEventListener('click', (event) => {
    const positionChanged = setContentPosition(event.target);
    if (positionChanged) {
        setTocAndBodyHeight();
    } else {
        // closeToc();
    }
});



// scroll event

document.addEventListener("scroll", (event) => {
    lastKnownScrollPosition = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            setTocNowView(lastKnownScrollPosition);
            ticking = false;
            lastKwownScrollElement = findTopElementPosition(lastKnownScrollPosition);
            setTocAndBodyHeight();
        });
    } else {
        ticking = true;
    }
});
