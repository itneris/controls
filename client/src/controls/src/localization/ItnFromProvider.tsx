import React, { ReactNode, createContext, useMemo } from "react";
import { FormLocalizationType } from "./FormLocalizationType";
import { localeRu } from "./dictionaries/localeRu";
import { localeEn } from "./dictionaries/localeEn";

type FormLocaleType = "ru" | "en" | FormLocalizationType;

export const ItnFormGlobalContext = createContext({
    locale: localeRu
});

const ItnFormProvider = (props: { children: ReactNode[], locale?: FormLocaleType }) => {
    const { children, locale } = props;

    const localeDict = useMemo(() => {
        if (locale === undefined) {
            return localeRu;
        }

        if (typeof locale === "object") {
            return locale;
        }

        switch (locale) {
            case "en":
                return localeEn;
            default:
                return localeRu;
        }
    }, [locale]);

    return (
        <ItnFormGlobalContext.Provider value={{ locale: localeDict }}>
            {children}
        </ItnFormGlobalContext.Provider>
    );
};

export default ItnFormProvider;