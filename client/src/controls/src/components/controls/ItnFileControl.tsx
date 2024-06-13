import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    FormControl,
    FormHelperText,
    IconButton,
    Typography,
    Tooltip,
    Button,
    Avatar,
    LinearProgress,
} from "@mui/material";
import {
    AttachFile,
    CloudUpload,
    Delete,
    Refresh,
} from "@mui/icons-material";
import ItnFormFile from "../../props/ItnFormFile";
import ItnModal from "../../components/ItnModal";
import Cropper, { Area, Point } from "react-easy-crop";
import { ItnFormGlobalContext } from "../../localization/ItnFromProvider";
import { FileImageProperties } from "../../props/IFileControlProps";

function compressImageToSize(sizeKb: number, canvas: HTMLCanvasElement) {
    let quality = 1.0; // Start with maximum quality
    let dataUrl: string;

    do {
        // Get the data URL of the image with the current quality
        dataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Check the size of the data URL
        const sizeInKB = dataUrl.length * (3 / 4) / 1024;
        
        if (sizeInKB <= sizeKb) {
            break; // If the size is within the limit, exit the loop
        }
        
        // Reduce the quality for the next iteration
        quality -= 0.1;
    } while (quality > 0);
    
    return dataUrl;
}

function ItnFileControl(props: {
    value: ItnFormFile | null,
    onChange?: (value: ItnFormFile | null) => void,
    imageProperties?: FileImageProperties,
    maxFileSize?: number,
    accept?: string,
    disabled?: boolean,
    label?: string,
    error?: boolean,
    errorText?: string,
    helperText?: string
}) {
    const {
        imageProperties,
        onChange,
        maxFileSize,
        accept,
        disabled,
        label,
        error,
        errorText,
        helperText        
    } = props;

    const { locale } = useContext(ItnFormGlobalContext);

    const value = props.value as (ItnFormFile | null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [fileError, setFileError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [imgProcessing, setImgProcessing] = useState<boolean>(false);

    const [cropModalOpen, setCropModalOpen] = useState(false);
    const openCropModal = useCallback((file: File) => {
        setCropModalOpen(true);
        setCroppingFile(file);
    }, []);
    const closeCropModal = useCallback(() => {
        setCropModalOpen(false);
    }, []);

    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);

    const [croppedArea, setCroppedArea] = useState<Area>();
    const [croppingFile, setCroppingFile] = useState<File>();

    useEffect(() => {
        if (!imageProperties) {
            return;
        }

        if (!value?.data && !value?.file) {
            imageProperties && setPreview(null);
            return;
        }

        if (value?.data) {
            setPreview(value.data);
            return;
        }

        const objectUrl = URL.createObjectURL(value.file as File);
        setPreview(objectUrl);

        return () => {
            objectUrl && URL.revokeObjectURL(objectUrl);
        }
    }, [value, imageProperties]);

    const handleUploadClick = useCallback(() => {
        //e.preventDefault();
        setFileError(null);
        fileInputRef.current!.click();
    }, []);

    const handleDeleteFile = useCallback(() => {
        onChange && onChange(new ItnFormFile(null));
    }, [onChange]);

    const uploadFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files.length) {
            onChange && onChange(null);
            return;
        }

        let file = e.target.files![0];
        if (maxFileSize && (file.size > maxFileSize)) {
            let size = maxFileSize;
            let unit = "Б";
            if (size > 1024) {
                size = Math.round(size / 10) / 100;
                unit = "Кб"
            }
            if (size > 1024) {
                size = Math.round(size / 10) / 100;
                unit = "Мб"
            }
            if (size > 1024) {
                size = Math.round(size / 10) / 100;
                unit = "Гб"
            }
            setFileError(locale.fileControl.fileSizeError.replace("{0}", `${size}${unit}`));
            return;
        }

        if (imageProperties?.crop?.dynamic) {
            openCropModal(file);
            e.target.value = "";
            return;
        } 
        
        if (imageProperties?.crop) {
            try {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const image = new Image();
                    image.onload = function () {
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d")!;
                        canvas.width = imageProperties!.crop!.width;
                        canvas.height = imageProperties!.crop!.height;
                        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                        
                        const dataUrl = imageProperties?.compressToKb ? 
                            compressImageToSize(imageProperties.compressToKb, canvas) :
                            canvas.toDataURL(file.type);

                        canvas.toBlob((blob) => {
                            const resFile = new File([blob!], file.name);
                            onChange && onChange(new ItnFormFile(resFile));
                        }, "image/jpeg", 1);

                        setPreview(dataUrl);
                        canvas.remove();
                    }
                    image.src = e.target!.result as string;
                }
                reader.readAsDataURL(e.target.files![0]);
                e.target.value = "";
            } catch (e) {
                setFileError(locale.fileControl.compressError);
                console.log(e);
            }
            return;
        }         

        onChange && onChange(new ItnFormFile(e.target.files![0]));
        e.target.value = "";
    }, [onChange, maxFileSize, openCropModal]);

    const handleCropModalResult = (result: boolean | null) => {
        if (!result) {
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const image = new Image();
                image.onload = function () {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d")!;


                    canvas.width = croppedArea!.width;
                    canvas.height = croppedArea!.height;

                    ctx.drawImage(
                        image, 
                        croppedArea!.x,
                        croppedArea!.y,
                        croppedArea!.width,
                        croppedArea!.height,
                        0,
                        0,
                        croppedArea!.width,
                        croppedArea!.height
                    );

                    const dataUrl = imageProperties?.compressToKb ? 
                        compressImageToSize(imageProperties.compressToKb, canvas) :
                        canvas.toDataURL(croppingFile!.type);

                    canvas.toBlob((blob) => {
                        const resFile = new File([blob!], croppingFile!.name);
                        onChange && onChange(new ItnFormFile(resFile));
                    }, "image/jpeg", 1);

                    setPreview(dataUrl);
                    canvas.remove();
                }
                image.src = e.target!.result as string;
            } catch {
            }
            
            setImgProcessing(false);
            closeCropModal();
        }
        reader.readAsDataURL(croppingFile!);
        setImgProcessing(true);
        return false;
    };

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedArea(croppedAreaPixels);
    }, []);

    const imageUrl = useMemo(() => {
        return croppingFile ? URL.createObjectURL(croppingFile) : ""
    }, [croppingFile]);

    return (
        <>
            <input
                disabled={disabled}
                ref={fileInputRef}
                type="file"
                hidden
                onChange={uploadFile}
                accept={accept}
            />
            <FormControl>
                {
                    value === null || (!value.file && !value.data) ?
                        <>
                            {
                                imageProperties?.isAvatar ?
                                    <Box
                                        borderRadius="50%"
                                        height={70}
                                        width={70}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        mr={3}
                                        onClick={handleUploadClick}
                                        sx={theme => ({
                                            cursor: "pointer",
                                            backgroundColor: theme.palette.primary.main
                                        })}
                                    >
                                        <CloudUpload color="inherit" />
                                    </Box> :
                                    <Button
                                        disabled={disabled}
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<CloudUpload />}
                                        onClick={handleUploadClick}
                                        style={{ alignSelf: "start" }}
                                    >
                                        {label}
                                    </Button>
                            }
                        </> :
                        !imageProperties ?
                            <Box display="flex" alignItems="center" width="100%">
                                <AttachFile />
                                <Typography style={{ flex: 1 }}>
                                    {value?.fileName ?? value?.file?.name ?? ""}
                                </Typography>
                                <Tooltip placement="right-start" title={locale.fileControl.replaceButtonText}>
                                    <IconButton color="secondary" onClick={handleUploadClick} disabled={disabled}>
                                        <Refresh />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip placement="right-start" title={locale.common.removeButtonText}>
                                    <IconButton color="error" onClick={handleDeleteFile} disabled={disabled}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Box> :
                            <Box display="flex" alignItems="stretch" width="100%">
                                {
                                    imageProperties?.isAvatar ?
                                        <Avatar
                                            src={preview!}
                                            style={{
                                                height: imageProperties?.previewSize?.height ?? 80,
                                                width: imageProperties?.previewSize?.width ?? 80
                                            }}
                                        /> :
                                        <Box
                                            borderRadius={1}
                                            height={imageProperties?.previewSize?.height ?? imageProperties?.crop?.height ?? 80}
                                            width={imageProperties?.previewSize?.width ?? imageProperties?.crop?.width ?? 80}
                                            sx={{
                                                background: `url("${preview}")`,
                                                backgroundPosition: "center",
                                                backgroundSize: "cover"
                                            }}
                                        />
                                }
                                <Box display="flex" flexDirection="column" ml={2} justifyContent="space-between">
                                    <Tooltip placement="right-start" title={locale.fileControl.replaceButtonText}>
                                        <IconButton color="secondary" onClick={handleUploadClick} disabled={disabled}>
                                            <Refresh />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip placement="right-start" title={locale.common.removeButtonText}>
                                        <IconButton color="error" onClick={handleDeleteFile} disabled={disabled}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                }
                <FormHelperText error={error}>{error ? errorText : (helperText ?? "")}</FormHelperText>
                {
                    fileError &&
                    <FormHelperText error>{fileError}</FormHelperText>
                }
            </FormControl>
            {
                imageProperties?.crop &&
                <ItnModal
                    open={cropModalOpen}
                    onClose={closeCropModal}
                    onResult={handleCropModalResult}
                    title={locale.fileControl.cropImageModalTitle}
                    size="lg"
                    yesBtnText={locale.fileControl.cropButtonText}
                    noBtnText={locale.common.cancelButtonText}
                    yesButtonDisabled={imgProcessing}
                >                
                    <Box height={4}>
                        <LinearProgress color="secondary" sx={{ display: imgProcessing ? "block" : "none" }} />
                    </Box>
                    <Box height={"70vh"} position={"relative"}>
                        <Cropper
                            image={imageUrl}
                            aspect={imageProperties?.crop?.width / imageProperties.crop?.height}
                            onCropComplete={onCropComplete}
                            crop={crop}
                            onCropChange={setCrop}
                            zoom={zoom}
                            onZoomChange={setZoom}
                        />                        
                    </Box>
                </ItnModal>
            }
        </>
    );
}

export default ItnFileControl;