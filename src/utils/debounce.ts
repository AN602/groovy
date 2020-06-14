export function debounce(callback: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function (this: any, ...args: any) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(context, args), wait);
    };
}