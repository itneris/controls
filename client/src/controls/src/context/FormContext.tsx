import React from "react";
import { IFormContext } from "./IFormContext";

const FormContext = React.createContext<IFormContext | null>(null);
export default FormContext;