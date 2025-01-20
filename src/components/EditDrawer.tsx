import { Box, Divider, Drawer, Fab, Theme, Tooltip, Typography } from "@mui/material";
import { Close, Delete, Save } from "@mui/icons-material";
import { DrawerProps, DrawerBtnProp } from '../types/DrawerProps';
import React, {  useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DrawerActionType } from "../types/DrawerActionType";
import { ItnFormGlobalContext } from "../providers/ItnFromProvider";

const EditDrawer = (props: DrawerProps) => {
    const {
        title = null,
        onResult = null,
        buttons = [],
        tabs = [],
        saveBtnText = null,
        cancelBtnText = null,
        deleteBtnText = null,
        defaultTab = 0,
        open: propsOpen,
        children,
        sx = {
            zIndex: 1290,
            width: '40%',
            '& .MuiDrawer-paper': {
                width: '40%',
                overflow: 'visible',
                boxSizing: 'border-box'
            },
        }
    } = props;

    const { locale } = useContext(ItnFormGlobalContext);

    const [activeTab, setActiveTab] = useState<number>(defaultTab);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        setOpen(propsOpen);
    }, [propsOpen])

    const handleResult = useCallback((result: DrawerActionType) => () => {
        setActiveTab(0);
        onResult && onResult(result);
    }, [onResult]);

    const buttonsRender: Array<React.ReactNode> = useMemo(() => {
        let buttons: Array<DrawerBtnProp> = [];
        if (cancelBtnText) {
            buttons.push({
                tooltip: locale.common.closeButtonText,
                icon: <Close />,
                onClick: handleResult('cancel'),
                color: "default"
            });
        }
        if (saveBtnText) {
            buttons.push({
                color: 'secondary',
                tooltip: locale.common.saveButtonText,
                icon: <Save />,
                onClick: handleResult("save")
            });
        }
        if (deleteBtnText) {
            buttons.push({
                color: 'error',
                tooltip: locale.common.removeButtonText,
                icon: <Delete />,
                onClick: handleResult("delete")
            });
        }
        if (buttons) {
            buttons = [...buttons, ...buttons];
        }
        return buttons.map((btn, index) => {
            return (
                <Tooltip
                    title={btn.tooltip ?? ""}
                    key={`db-${index}`}
                    placement="left"
                >
                    <Fab color={btn.color} onClick={btn.onClick} size="small">
                        {btn.icon}
                    </Fab>
                </Tooltip>
            )
        });
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
                        zIndex={1290}
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
                            bgcolor="rgba(255, 255, 255, 0.2)"
                            sx={{ borderBottomLeftRadius: "10px" }}
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
                                    sx={(theme: Theme) => ({
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
                                sx={(theme: Theme) => ({ backgroundColor: theme.palette.background.paper })}
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
                            tabs.map((tab, index) => {
                                return (
                                    <Box
                                        key={"tab-" + index}
                                        display={index === activeTab ? 'block' : 'none'}
                                    >
                                        {tab.component}
                                    </Box>
                                );
                            })
                        }
                        {children}
                    </Box>
                </Box>
            </Drawer>
        </>
    );
};

export default EditDrawer;