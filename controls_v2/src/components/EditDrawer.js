import React, { forwardRef, useCallback } from "react";
import { Box, Drawer, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Close, Delete, Save } from "@mui/icons-material";
import Fab from '@mui/material/Fab';
import HtmlToolTip from '../components/HtmlTooltip'
import { useMemo } from "react";
import { useState } from "react";
import { useImperativeHandle } from "react";

const EditDrawer = forwardRef((props, ref) => {
    const {
        open,
        children,
        onClose,
        title,
        onDelete,
        onSave,
        buttons: propsButtons,
        tabs
    } = props;

    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);

    useImperativeHandle(ref, () => ({
        setTab(tabIndex) {
            setActiveTab(tabIndex);
        }
    }));

    const handleClose = useCallback((type) => () => {
        setActiveTab(0);
        onClose(type);
    }, [onClose]);

    const buttons = useMemo(() => {
        let btns = [{
            tooltip: 'Закрыть',
            icon: <Close />,
            onClick: handleClose('btn')
        }];
        if (onSave) {
            btns.push({
                color: 'secondary',
                tooltip: 'Сохранить',
                icon: <Save />,
                onClick: onSave
            });
        }
        if (onDelete) {
            btns.push({
                color: 'error',
                tooltip: 'Удалить',
                icon: <Delete />,
                onClick: onDelete
            });
        }
        if (propsButtons) {
            btns = [...btns, ...propsButtons];
        }
        return btns.map((btn, index) => <HtmlToolTip
            title={btn.tooltip}
            key={`db-${index}`}
            placement="left"
        >
            <Fab variant="contained" color={btn.color} onClick={btn.onClick} size="small">
                {btn.icon}
            </Fab>
        </HtmlToolTip>);
    }, [onSave, onDelete, propsButtons, onClose]);

    const handleTabChange = useCallback(index => setActiveTab(index), [setActiveTab]);

    return (
        <>
            <Drawer
                anchor='right'
                open={open}
                onClose={handleClose('auto')}
                sx={{
                    width: '40%',
                    '& .MuiDrawer-paper': {
                        width: '40%',
                        overflow: 'visible',
                        backgroundColor: "#eee",
                        boxSizing: 'border-box',
                    },
                }}
            >
                {
                    (open && buttons) &&
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
                            backgroundColor="rgba(255, 255, 255, 0.7)"
                        >
                            {buttons}
                        </Box>
                        {
                            tabs && tabs.map((tab, index) =>
                                <Box
                                    key={"tab-btn" + index}
                                    height={180}
                                    top={0}
                                    backgroundColor={index === activeTab ? theme.palette.secondary.main : "rgba(255, 255, 255, 0.7)"}
                                    color={index === activeTab ? "white" : "black"}
                                    onClick={() => handleTabChange(index)}
                                    sx={{ cursor: "pointer" }}
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
                                        {tab.label}
                                    </Typography>
                                </Box>
                            )
                        }
                    </Box>
                }
                <Box
                    pl={2}
                    pr={2}
                    pb={2}
                    overflowY="auto"
                    width="100%"
                    sx={{ overflowY: "auto" }}
                >
                    <Box
                        position="sticky"
                        top={0}
                        bgcolor={theme?.palette?.background?.dark || "#eee"}
                        zIndex={1}
                        py={2}
                    >
                        <Typography variant='h5'>{tabs ? tabs[activeTab].label : title}</Typography>
                        {
                            tabs && tabs[activeTab].subtitle ?
                                <Typography variant='subtitle2'>{tabs[activeTab].subtitle}</Typography> :
                                null
                        }
                    </Box>
                    {
                        tabs &&
                        tabs.map((tab, index) => <Box
                            key={"tab-" + index}
                            display={index === activeTab ? 'block' : 'none'}
                        >
                            {tab.component}
                        </Box>)
                    }
                    {children}
                </Box>
            </Drawer>
        </>
    );
});

export default EditDrawer;