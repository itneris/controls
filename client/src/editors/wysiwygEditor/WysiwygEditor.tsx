import React, { useMemo, useRef } from 'react';
import { useCallback } from 'react';

import katex from "katex";
import "katex/dist/katex.min.css";
import SunEditor from "suneditor-react";
import SunEditorCore from "suneditor/src/lib/core";
import "suneditor/dist/css/suneditor.min.css";
import IWysiwygEditorProps from './IWysiwygEditorProps';
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

function WysiwygEditor(props: IWysiwygEditorProps) {
    const editor = useRef<SunEditorCore>();

    const getSunEditorInstance = useCallback((sunEditor: SunEditorCore) => {
        editor.current = sunEditor;
    }, []);

    const updateText = useCallback((text: string) => {
        props.onChange && props.onChange(text);
    }, [props]);

    const handleUploadImage = useCallback(async (data: File): Promise<string> => {
        if (props.onImageSave) {
            return await props.onImageSave(data);
        }

        return "";
    }, [props]);

    const btnList = useMemo(() => {
        if (props.buttonList) {
            return props.buttonList;
        }

        return [
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

            props.onImageSave ? ["table", "link", "image"] : ["table", "link"],
            ["math"], //You must add the 'katex' library at options to use the 'math' plugin.
            ["removeFormat"]

        ]
    }, [props.onImageSave, props.buttonList]);

    const handleImageUploadBefore = useCallback((files: File[], info: Object, uploadHandler: Function) => {
        handleUploadImage(files[0])
            .then(url => {
                const response = {
                    "result": [
                        {
                            "url": `${url}`,
                            "name": files[0].name,
                            "size": files[0].size
                        },
                    ]
                };
                uploadHandler(response);
            });

        return undefined;
    }, [handleUploadImage]);

    const onPaste = useCallback((e: ClipboardEvent, cleanData: string, maxCharCount: boolean) => {
        if (e.clipboardData !== null) {
            const domParser = new DOMParser();

            const data = e.clipboardData?.getData('text/html');
            const initialHtmlDoc = domParser.parseFromString(data, 'text/html');
            var initialImages = initialHtmlDoc.getElementsByTagName('img');

            const cleanedHtmlData = domParser.parseFromString(cleanData, 'text/html');
            var cleanedImages = cleanedHtmlData.getElementsByTagName('img');

            var cleanedIndex = 0;
            for (var initialIndex = 0, len = initialImages.length; initialIndex < len; initialIndex++) {
                if (cleanedIndex >= cleanedImages.length || initialImages[initialIndex].src !== cleanedImages[cleanedIndex].src) {
                    initialImages[initialIndex].removeAttribute("style");

                    // they are different, so we have to find where to insert it
                    // tags are changed on cleanup, so we have to match by neighboring content
                    var prevSibilingWithContent: ChildNode | null | undefined = initialImages[initialIndex].previousSibling;
                    while (prevSibilingWithContent?.textContent === undefined) {
                        prevSibilingWithContent = prevSibilingWithContent?.previousSibling;
                    }

                    // no sibiling for matching found, so better drop it
                    if (prevSibilingWithContent === null) {
                        cleanedIndex += 1;
                        continue;
                    }

                    // cleanup puts all text in <p> tags
                    var cleanedPrevElem: HTMLElement | null = null;
                    var cleanedText = cleanedHtmlData.getElementsByTagName("p");
                    for (var i = 0, searchLen = cleanedText.length; i < searchLen; i++) {
                        if (cleanedText[i].textContent === prevSibilingWithContent.textContent) {
                            //prev tag found
                            cleanedPrevElem = cleanedText[i];
                            break;
                        }
                    }

                    if (cleanedPrevElem === null) {
                        //previous content not found in cleaned data
                        cleanedIndex += 1;
                        continue;
                    }

                    // now let's insert
                    cleanedPrevElem.parentNode?.insertBefore(initialImages[initialIndex], cleanedPrevElem);

                } else {
                    // they are the same, so we skip
                    cleanedIndex += 1;
                }
            }

            return new XMLSerializer().serializeToString(cleanedHtmlData);
        }
    }, []);

    return (
        <Box sx={{
            "& .sun-editor-editable":
            {
                fontFamily: "RosatomWeb, Arial !important",
                fontSize: "16px !important"
            }
        }}>
            <SunEditor
                getSunEditorInstance={getSunEditorInstance}
                lang="ru"
                setContents={props.value ?? ""}
                autoFocus={false}
                onChange={updateText}
                onPaste={onPaste}
                onImageUploadBefore={props.onImageSave ? handleImageUploadBefore : undefined}
                setOptions={{
                    buttonList: btnList,
                    defaultTag: "div",
                    minHeight: props.minHeight!,
                    showPathLabel: false,
                    font: props.availableFonts!,
                    katex: katex,
                    historyStackDelayTime: 300
                }}
            />
        </Box>
    );
}


WysiwygEditor.defaultProps = {
    availableFonts: EditorFonts,
    minHeight: "300px"
}

export default WysiwygEditor;