import { Inertia } from '@inertiajs/inertia';
import { queues, Reflect as canReflect, StacheElement } from 'can';
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
        const updateComponent = (page) => {
            store.component.assignDeep(page.props);
        };

        canReflect.onKeyValue(store, 'page', updateComponent);

        Inertia.init({
            initialPage: this.initialPage,
            resolveComponent: this.resolveComponent,
            transformProps: this.transformProps,
            swapComponent: async ({ component, page, preserveState }) => {
                queues.batch.start();
                canReflect.update(store, {
                    component,
                    page,
                    key: preserveState ? store.key : Date.now(),
                });
                queues.batch.stop();
            }
        });

        return () => {
            canReflect.offKeyValue(store, 'page', updateComponent);
        };
    }
}

customElements.define('inertia-app', InertiaApp);
