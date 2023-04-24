import React, { useMemo, useEffect } from 'react';
import parse, { Element } from 'html-react-parser';
import DOMPurify from 'dompurify';
import { Box } from '@mui/material';
import 'katex/dist/katex.min.css';
import IWysiwygViewerProps from './IWysiwygViewerProps';


export default function WysiwygViewer(props: IWysiwygViewerProps) {
    useEffect(() => {
        DOMPurify.addHook('afterSanitizeAttributes', function (node) {
            if ('target' in node) {
                node.setAttribute('target', '_blank');
                node.setAttribute('rel', 'noreferrer noopener');
            }
        });

        return () => {
            DOMPurify.removeHooks('afterSanitizeAttributes');
        };
    }, []);

    const content = useMemo(() => {
        if (!props.content) {
            return "";
        }
        return parse(DOMPurify.sanitize(props.content), {
            replace: domNode => {
                if (domNode instanceof Element && domNode.attribs.class === "katex-mathml") {
                    return <></>;
                }
            }
        })
    }, [props.content]);

    return <Box sx={{
            "& img":
            {
                maxWidth:'100%'
            },
            "& table":
            {
                display: "table",
                tableLayout: "auto !important",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "rgb(204, 204, 204)",
                width: "100%",
                maxWidth: "100%",
                marginBottom: "10px",
                backgroundColor: "transparent",
                borderSpacing: 0,
                borderCollapse: "collapse"
            },
            "& table thead":
            {
                borderBottomWidth: 2,
                borderBottomColor: "#333",
                borderBottomStyle: "solid"
            },
            "& table tr":
            {
                borderWidth: 1,
                borderColor: "#efefef",
                borderStyle: "solid"
            },
            "& table th":
            {
                backgroundColor: "#f3f3f3",
            },
            "& table th, & table td":
            {
                borderWidth: 1,
                borderColor: "#e1e1e1",
                borderStyle: "solid",
                padding: "0.4em",
                backgroundClip: "padding-box"
            },
            "& table.se-table-size-auto":
            {
                width: "auto !important"
            },
            "& table.se-table-size-100":
            {
                width: "100% !important"
            },
            "& table.se-table-layout-auto":
            {
                tableLayout: "auto !important"
            },
            "& table.se-table-layout-fixed":
            {
                tableLayout: "fixed !important"
        }
        }}
     >
        {content}
    </Box>;
}
