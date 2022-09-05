import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import PageTitle from "./controls/components/PageTitle";
import AbstractFieldBuilder from "./controls/fieldBuilder/AbstractFieldBuilder";

interface ICocktailDTO {
    id: string;
    name: string;
    price: number;
    ingridients: string[];
    createDate: Date | null;
    glassType: number;
}

/*class CocktailsFieldBuilder extends AbstractFieldBuilder<ICocktailDTO> {
    constructor() {
        super();
        this.FieldFor(_ => _.name)
            .WithLabel("Наименование");
    }
}

const fieldBuilder = new CocktailsFieldBuilder();*/

const TestComnonent = () => {
    const queryClient = useQueryClient();
    return (
        <>
            <PageTitle>qwe</PageTitle>
        </>
    );
}

export default TestComnonent;