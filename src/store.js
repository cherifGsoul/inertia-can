import { DeepObservable, Reflect as canReflect} from "can";

const store = canReflect.new(DeepObservable, {
    component: undefined,
    key: undefined,
    page: {}
});

export default store;
