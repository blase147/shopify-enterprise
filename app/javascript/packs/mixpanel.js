var mixpanel = require('mixpanel-browser');
mixpanel.init("467d5df251a711e7b0ae20d18c8fb2e1", {
    debug: true, 'loaded': function () {
        window.gloabalMixpanelId = mixpanel.get_distinct_id();
    }
});

window.global_mixpanel = mixpanel

console.log("mixpanel", mixpanel);

window.mixpanelIdentify = function (id) {
    mixpanel.identify(id)
}

window.mixpanelGetIdentify = function () {
    mixpanel.identify()
}

window.mixpanelTrack = function (name, props) {
    if (props) {
        mixpanel.track(name, props)
    } else {
        mixpanel.track(name)
    }
}

window.mixpanelPeopleSetOnce = async function (props) {
    let response = await mixpanel.people.set_once(props);
    return response;
}

window.mixpanelAlias = function (value) {
    mixpanel.alias(value)
}