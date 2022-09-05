import { QueryClient } from "@tanstack/react-query";
import React from "react";
import { LooseObject } from "../base/LooseObject";
import AbstractFieldBuilder from "../fieldBuilder/AbstractFieldBuilder";

export default interface IFormProps {
    queryClient: QueryClient;
    fieldBuilder: AbstractFieldBuilder<LooseObject>;
    onChange?: ((prop: string, value: any) => void) | null;
    noPadding?: boolean;
    onSave?: (() => void) | null;
    onCancel?: (() => void) | null;
    entity?: LooseObject | null;
    id?: string | null;
    type?: "view" | "create" | "edit" | "auto" | null;
    hidePaper?: boolean | null;
    header?: string | null;
    variant?: "standard" | "filled" | "outlined" | null;
    disableSave?: boolean | null;
}