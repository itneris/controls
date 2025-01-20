import { ReactNode, createContext, useMemo } from "react";
import { FormLocalizationType } from "../localization/FormLocalizationType";
import { localeRu } from "../localization/dictionaries/localeRu";
import { localeEn } from "../localization/dictionaries/localeEn";

type FormLocaleType = "ru" | "en" | FormLocalizationType;

export const ItnFormGlobalContext = createContext({
    locale: localeRu
});

const ItnFormProvider = (props: { children: ReactNode, locale?: FormLocaleType }) => {
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