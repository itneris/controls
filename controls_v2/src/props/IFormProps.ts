import { QueryClient } from "@tanstack/react-query";
import React from "react";
import { LooseObject } from "../base/LooseObject";
import { AbstractFieldBuilder } from "../fieldBuilder/AbstractFieldBuilder";
import { FieldOptionsBuilder } from "../fieldBuilder/FieldOptionsBuilder";

export default interface IFormProps {
    onChange?: ((prop: string, value: any) => void) | null;
    noPadding?: boolean;
    onSave?: (() => void) | null;
    onCancel?: (() => void) | null;
    entity?: LooseObject | null;
    id?: string | null;
    queryClient: QueryClient,
    type?: "view" | "create" | "edit" | "auto",
    fieldBuilder: AbstractFieldBuilder<LooseObject>;
    hidePaper: boolean;
    header: string | null;
    variant: "standard" | "filled" | "outlined";
    disableSave: boolean;
}