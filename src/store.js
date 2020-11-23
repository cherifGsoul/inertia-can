import { DeepObservable, Reflect as canReflect} from "can";

const store = canReflect.new(DeepObservable, {
    component: null,
    page: {},
    key: null,
});

export default store;
