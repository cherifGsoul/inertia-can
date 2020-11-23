import { Inertia } from '@inertiajs/inertia';
import { queues, Reflect as canReflect, StacheElement, type } from 'can';
import { default as store } from './store';

export default class InertiaApp extends StacheElement {
    static view = `
            {{# if (this.component) }}
                {{ this.component }}
            {{/ if }}
        `;

    static props = {
        initialPage: { type: Object, required: true },
        resolveComponent: { type: Function, required: true },
        transformProps: { type: Function, default: (props) => props }
    }

    get component() {
        // returns the component layout if is present
        // useful for persistent layouts
        // https://inertiajs.com/pages#persistent-layouts
        return store.component && store.component.layout || store.component;
    }

    connected() {

        Inertia.init({
            initialPage: this.initialPage,
            resolveComponent: this.resolveComponent,
            transformProps: this.transformProps,
            swapComponent: async ({ component, page, preserveState }) => {
                this.preserveState = preserveState;
                // Change the component only when the state is not preserved
                // and the current component is not the same as the requested component
                queues.batch.start();
                canReflect.update(store, {
                    component: (preserveState && store.component instanceof component) ? store.component : new component,
                    page,
                    key: preserveState ? store.key : Date.now(),
                });
                canReflect.eachKey(page.props, (val, prop) => {
                    canReflect.setKeyValue(store.component, prop, val);
                });
                queues.batch.stop();
            }
        });
    }
}

customElements.define('inertia-app', InertiaApp);
