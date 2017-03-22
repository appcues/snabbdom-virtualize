// because TypeScript's HTMLElement seems lacking: https://github.com/Microsoft/TSJS-lib-generator/issues/101
interface HTMLElement {
    onautocomplete: (this: HTMLElement, ev: Event) => any
    onautocompleteerror: (this: HTMLElement, ev: Event) => any
    oncancel: (this: HTMLElement, ev: Event) => any
    onclose: (this: HTMLElement, ev: Event) => any
    ondragexit: (this: HTMLElement, ev: Event) => any
    onresize: (this: HTMLElement, ev: Event) => any
    onshow: (this: HTMLElement, ev: Event) => any
    ontoggle: (this: HTMLElement, ev: Event) => any
}
