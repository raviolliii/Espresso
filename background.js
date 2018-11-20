chrome.runtime.onMessage.addListener(function(req, sender, sendRes) {
	if (req.type === "new tab") {
		chrome.tabs.query({}, function(tabs) {
			tabs = tabs.filter(e => filterByKeywords(e, req.content)) || tabs; 
			if (tabs.length > 0) {
				chrome.tabs.update(tabs[0].id, {active: true});
				return;
			}
			chrome.history.search({
				text: req.content.toLowerCase(),
				maxResults: 10
			}, function(history) {
				history = history.sort((a, b) => b.visitCount - a.visitCount) || history;
				if (history.length > 0) {
					chrome.tabs.create({ url: history[0].url });
					return;
				}
				chrome.tabs.create({
					url: "https://www.google.com/search?q=" + encodeURIComponent(req.content.toLowerCase())
				});
			});
		});
	}
});

function filterByKeywords(tab, phrase) {
	let url = tab.url.includes(phrase.toLowerCase());
	let title = tab.title.toLowerCase().includes(phrase.toLowerCase());
	return url || title;
}
