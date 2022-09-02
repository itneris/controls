const styles = (theme) => ({
    topDiv: {
        alignItems: "center",
        display: 'flex',
        marginBottom: 20,
        justifyContent: 'space-between'
    },
    tooltip: {
        width: 620,
        whiteSpace: "pre-line",
        fontSize: 12,
        padding: 24,
        lineHeight: "20px",
        color: theme.palette.text.primary,
        borderRadius: 2,
        boxShadow: "0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)",
        backgroundColor: "white"
    },
    tooltipFiles: {
        maxWidth: 1200,
        whiteSpace: "pre-line",
        fontSize: 12,
        padding: 24,
        lineHeight: "20px",
        color: theme.palette.text.primary,
        borderRadius: 2,
        boxShadow: "0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)",
        backgroundColor: "white"
    },
    question: {
        marginLeft: 5,
        cursor: 'pointer',
        color: "grey",
        '&:hover': {
            color: theme.palette.secondary.main
        }
    },
    bold: {
        fontWeight: 'bold'
    },
    layer: {
        padding: "6px 16px 16px 16px",
        marginTop: 20,
        marginBottom: 20
    },
});

export default styles;