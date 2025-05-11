
 export function createDefaultDict<T>(factory: () => T): Record<string, T> {
    return new Proxy({} as Record<string, T>, {
        get(target, name: string) {
            if (!(name in target)) {
                target[name] = factory();
            }
            return target[name]
        }
    })
}
