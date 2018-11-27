var presets = {
    "work": ["https://mail.google.com/mail/u/1/#inbox", "https://sakai.rutgers.edu/portal"],
    "chill": ["https://www.netflix.com"]
}

function filterByKeywords(tab, phrase) {
    let url = tab.url.includes(phrase.toLowerCase());
    let title = tab.title.toLowerCase().includes(phrase.toLowerCase());
    return url || title;
}

function openTabs(urls) {
    for (let i = 0; i < urls.length; i++) {
        chrome.tabs.create({ url: urls[i] });
    }
}

function historyHandler(phrase) {
    return function(history) {
        history = history.sort((a, b) => b.visitCount - a.visitCount) || history;
        if (history.length > 0) {
            openTabs([history[0].url]);
            return;
        }
        let url = "https://www.google.com/search?q=" + encodeURIComponent(phrase);
        openTabs([url]);
    }
}

function queryHandler(phrase) {
    return (function(tabs) {
        tabs = tabs.filter(e => filterByKeywords(e, phrase)) || tabs; 
        if (tabs.length > 0) {
            chrome.tabs.update(tabs[0].id, {active: true});
            return;
        }
        chrome.history.search({
            text: phrase,
            maxResults: 10
        }, historyHandler(phrase));
    });
}

chrome.runtime.onMessage.addListener(function(req, sender, sendRes) {
    req.content = req.content.toLowerCase().trim();

    if (req.type === "new tab") {
        if (req.content[0] === "/") {
            let preset = req.content.substring(req.content.indexOf("/") + 1);
            openTabs(presets[preset] || []);
            return;
        }
        chrome.tabs.query({}, queryHandler(req.content));
    }
});

