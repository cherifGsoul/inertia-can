import { DeepObservable, ObservableObject, observe, Reflect as canReflect, SimpleObservable } from 'can';
import { Inertia } from "@inertiajs/inertia";

const remember = (initialState, key) => {
    const restored = Inertia.restore(key);
    const store = canReflect.new(DeepObservable, restored !== undefined ? restored : initialState);
    canReflect.onPatches(store, (patches) => {
        const state = canReflect.unwrap(store);
        Inertia.remember(state, key);
    });

    return store;
};

export default remember;
