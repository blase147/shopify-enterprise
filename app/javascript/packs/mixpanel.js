var mixpanel = require('mixpanel-browser');
mixpanel.init("467d5df251a711e7b0ae20d18c8fb2e1", { debug: true });
window.global_mixpanel = mixpanel

console.log("mixpanel", mixpanel);

window.mixpanelIdentify = function (id) {
    mixpanel.identify(id)
}
window.mixpanelTrack = function (name, props) {
    if (props) {
        mixpanel.track(name, props)
    } else {
        mixpanel.track(name)
    }
}

window.mixpanelPeopleSetOnce = function (props) {
    console.log(props);
    mixpanel.people.set_once(props)
}

window.mixpanelIdentify = function () {
    mixpanel.identify();
}