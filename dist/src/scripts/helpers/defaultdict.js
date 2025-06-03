export function createDefaultDict(factory) {
    return new Proxy({}, {
        get(target, name) {
            if (name === 'then') {
                return undefined;
            }
            ;
            if (!(name in target)) {
                target[name] = factory();
            }
            return target[name];
        }
    });
}
