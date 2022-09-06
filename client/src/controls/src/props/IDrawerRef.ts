export default interface IDrawerRef {
    /**
     * Opens drawer
     * */
    open: () => void;
    /**
     * Sets drawer active tab
     * 
     * @param {numnber} tab 0-based index of tab
     * */
    setTab: (tab: number) => void;
}