const useBrowserStorage = () => {

    const local = "local";
    const session = "session";

    const browserStorage = (
        type: string,
        key: string,
        value?: any
    ) => {
        if (type === "local") {
            if (value) {
                localStorage.setItem(key, value);
            } else {
                return localStorage.getItem(key);
            }
        } else if (type === "session") {
            if (value) {
                sessionStorage.setItem(key, value);
            } else {
                return sessionStorage.getItem(key);
            }
        }
        return;
    };

    return { browserStorage, local, session };
}

export default useBrowserStorage;