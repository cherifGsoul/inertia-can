import { stache } from "can";

// Stache helper to use Ziggy inside templates
// https://github.com/tighten/ziggy
if(window && window.route) {
    stache.addHelper('ziggyRoute', (name, params, absolute) => {
        return route(name, params, absolute);
    });
}
