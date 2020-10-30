import { Observation } from "can";
import store from "./store";

const page = new Observation(function observeProps() {
    return store.page;
})

export default page;
