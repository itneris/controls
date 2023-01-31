import { useCallback, useEffect, useRef, useState } from 'react';

import katex from "katex";
import "katex/dist/katex.min.css";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { Box } from '@mui/material';


const EditorFonts = [
    "Arial",
    "Comic Sans MS",
    "Courier New",
    "Impact",
    "Georgia",
    "Tahoma",
    "Trebuchet MS",
    "Verdana",
    "Logical",
    "Salesforce Sans",
    "Garamond",
    "Sans-Serif",
    "Serif",
    "Times New Roman",
    "Helvetica",
].sort();

export default function ContentEditor(props: {
    value: string;
    onChange: ((value: string) => void)
}) {

    const updateText = useCallback((text: string) => {
        console.log(text);
        props.onChange(text);
        //props.onChange(text);
        //console.log(props.onChange.name);
        //console.log(props.onChange);

    }, [props]);

    return (
        <Box sx={{
            "& .sun-editor-editable":
            {
                fontFamily: "RosatomWeb, Arial !important",
                fontSize: "16px !important"
            }
        }}>
            <SunEditor
                lang="ru"
                setContents={props.value}
                onChange={(data: any) => updateText(data)}//(event, data) => { updateText(data); }}
                setOptions={{
                    buttonList: [
                        ["undo", "redo"],
                        ["font", "fontSize"],
                        [
                            "bold",
                            "underline",
                            "italic",
                            "strike",
                            "subscript",
                            "superscript"
                        ],
                        ["fontColor", "hiliteColor"],
                        ["align", "list", "lineHeight"],
                        ["outdent", "indent"],

                        ["table", "link", "image"],
                        ["math"], //You must add the 'katex' library at options to use the 'math' plugin.
                        ["removeFormat"]

                    ],
                    defaultTag: "div",
                    minHeight: "300px",
                    showPathLabel: false,
                    font: EditorFonts,
                    katex: katex
                }}
            />
        </Box>
    );
}