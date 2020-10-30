import { shouldIntercept, Inertia } from "@inertiajs/inertia";
import { StacheElement, DeepObservable, type } from "can";

export default class Link extends StacheElement {
    static view = `
            <a
                href="{{this.href}}"
                on:el:click="this.visit(scope.event)"
                {{# if (this.hasClasses()) }}
                    class:from="this.classname"
                {{/ if }}
            >
                {{ this.linkTemplate() }}
            </a>
    `;

    static pros = {
        data: {
            type: type.maybeConvert(DeepObservable)
        },
        href: {
            type: String
        },
        method: {
            type: String,
            default: 'get'
        },
        replace: {
            type: Boolean,
            default: false
        },
        preserveScroll: {
            type: Boolean,
            default: false
        },
        preserveState: {
            type: Boolean,
            default: false
        },
        only: {
            type: type.maybeConvert(DeepObservable)
        },
        headers: {
            type: type.maybeConvert(DeepObservable)
        },

        linkTemplate: {
            type: Function,
            required: true
        },
        classname: {
            type: type.maybeConvert(String)
        }
    }

    visit(event) {
        this.dispatch('click', [event]);

        if (shouldIntercept(event)) {
            event.preventDefault();
            Inertia.visit(this.href, {
                data: this.data,
                method: this.method,
                preserveScroll: this.preserveScroll,
                preserveState: this.preserveState,
                replace: this.replace,
                only: this.only,
                headers: this.headers
            });
        }
    }

    hasClasses() {
        return typeof this.classname === 'string';
    }
}

customElements.define('inertia-link', Link);
