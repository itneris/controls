import { Box, Divider, Drawer, Tooltip, Typography } from "@mui/material";
import { Close, Delete, Save } from "@mui/icons-material";
import Fab from '@mui/material/Fab';
import IDrawerProps, { DrawerBtnProp } from '../props/IDrawerProps';
import IDrawerRef from '../props/IDrawerRef';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from "react";

const EditDrawer = forwardRef<IDrawerRef, IDrawerProps>((props, ref) => {
    const {
        title = null,
        onResult = null,
        buttons = [],
        tabs = [],
        saveBtnText = null,
        cancelBtnText = null,
        deleteBtnText = null,
        children,
        sx = {
            width: '40%',
            '& .MuiDrawer-paper': {
                width: '40%',
                overflow: 'visible',
                boxSizing: 'border-box',
                backgroundColor: "#eee"
            },
        }
    } = props;
    const [activeTab, setActiveTab] = useState<number>(0);
    const [open, setOpen] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        setTab(tabIndex) {
            setActiveTab(tabIndex);
        },
        open() {
            setOpen(true);
        }
    }));

    const handleResult = useCallback((result: "delete" | "save" | "cancel" | "hide") => () => {
        setActiveTab(0);
        onResult && onResult(result);
        setOpen(false);
    }, [onResult]);

    const buttonsRender: Array<React.ReactNode> = useMemo(() => {
        let btns: Array<DrawerBtnProp> = [];
        if (cancelBtnText) {
            btns.push({
                tooltip: 'Закрыть',
                icon: <Close />,
                onClick: handleResult('cancel'),
                color: "default"
            });
        }
        if (saveBtnText) {
            btns.push({
                color: 'secondary',
                tooltip: 'Сохранить',
                icon: <Save />,
                onClick: handleResult("save")
            });
        }
        if (deleteBtnText) {
            btns.push({
                color: 'error',
                tooltip: 'Удалить',
                icon: <Delete />,
                onClick: handleResult("delete")
            });
        }
        if (buttons) {
            btns = [...btns, ...buttons];
        }
        return btns.map((btn, index) => (
            <Tooltip
                title={btn.tooltip ?? ""}
                key={`db-${index}`}
                placement="left"
            >
                <Fab color={btn.color} onClick={btn.onClick} size="small">
                    {btn.icon}
                </Fab>
            </Tooltip>
        ));
    }, [handleResult, buttons, cancelBtnText, deleteBtnText, saveBtnText]); 

    const handleTabChange = useCallback((index: number) => setActiveTab(index), [setActiveTab]);

    return (
        <>
            <Drawer
                anchor='right'
                open={open}
                onClose={handleResult('hide')}
                sx={sx}
            >
                {
                    (open && buttonsRender.length > 0) &&
                    <Box
                        zIndex={1300}
                        position="absolute"
                        left="-56px"
                        width={56}
                    >
                        <Box
                            px={1}
                            py={2}
                            display="flex"
                            top={0}
                            flexDirection="column"
                            justifyContent="top"
                            gap={2}
                            bgcolor="rgba(255, 255, 255, 0.7)"
                        >
                            {buttonsRender}
                        </Box>
                        {
                            tabs.length > 0 && tabs.map((tab, index) => (
                                <Box
                                    key={"tab-btn" + index}
                                    height={180}
                                    top={0}
                                    color={index === activeTab ? "white" : "black"}
                                    onClick={() => handleTabChange(index)}
                                    sx={theme => ({
                                        cursor: "pointer",
                                        backgroundColor: index === activeTab ? theme.palette.secondary.main : "rgba(255, 255, 255, 0.7)"
                                    })}
                                    borderTop="1px solid grey"
                                >
                                    <Typography
                                        sx={{
                                            width: "180px",
                                            transform: "translate(-60px, 78px) rotate(-90deg)",
                                            whiteSpace: "nowrap",
                                            WebkitTransformOrigin: "50%  51%"
                                        }}
                                        align="center"
                                    >
                                        {tab.title}
                                    </Typography>
                                </Box>
                            ))
                        }
                    </Box>
                }
                <Box
                    pb={2}
                    width="100%"
                    sx={{ overflowY: "auto" }}
                >
                    {
                        (title || tabs.length > 0) &&
                        <>
                            <Box
                                position="sticky"
                                top={0}
                                sx={theme => ({ backgroundColor: theme.palette.background.paper })}
                                zIndex={1}
                                pl={2}
                                pt={2}
                                mb={2}
                            >
                                <Typography variant='h5'>{tabs.length > 0 ? tabs[activeTab].title : title}</Typography>
                                {
                                    (tabs.length > 0 && tabs[activeTab].subtitle) &&
                                    <Typography variant='subtitle2'>{tabs[activeTab].subtitle}</Typography>
                                }
                                <Divider sx={{ ml: -2, mt: 2 }} />
                            </Box>
                        </>
                    }
                    <Box paddingX={2}>
                        {
                            tabs.length > 0 &&
                            tabs.map((tab, index) => <Box
                                key={"tab-" + index}
                                display={index === activeTab ? 'block' : 'none'}
                            >
                                {tab.component}
                            </Box>)
                        }
                        {children}
                    </Box>
                </Box>
            </Drawer>
        </>
    );
});

export default EditDrawer;