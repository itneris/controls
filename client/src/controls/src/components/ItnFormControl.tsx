import { useContext, useMemo } from 'react';
import { Typography } from '@mui/material';
import FormContext from '../context/FormContext';

export interface IntFormControlProps {
    field: string;
}

const ItnFormControl = (props: IntFormControlProps) => {
    const formCtx = useContext(FormContext);

    const control = useMemo(() => {
        if (!formCtx) {
            return <Typography variant="body2">This conponent cannot be renderen without form context</Typography>;
        }
        const formControl = formCtx.getField(props.field);
        if (formControl === null) {
            return <Typography variant="body2">Wrong field name {props.field}</Typography>;
        }
        return formControl;
    }, [formCtx, props.field]);



    return <>
        {control}
    </>;
}

export default ItnFormControl;