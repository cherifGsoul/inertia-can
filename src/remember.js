import { DeepObservable, Reflect as canReflect } from 'can';
import { Inertia } from "@inertiajs/inertia";

const remember = (initialState, key) => {
    const restored = Inertia.restore(key);
    const store = restored !== undefined ? canReflect.new(DeepObservable, restored) : canReflect.new(DeepObservable, initialState);
    canReflect.onPatches(store, () => {
        Inertia.remember(store.serialize());
    });

    return store;
};

export default remember;
