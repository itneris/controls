export default interface IDrawerRef {
    /**
     * Opens drawer
     * */
    open: () => void;
    /**
     * Sets drawer active tab
     * Function params:
     *      tab: number, 0-based index of tab
     * */
    setTab: (tab: number) => void;
}