import { React } from 'react';
import { Skeleton } from '@mui/material';
import { useMemo } from 'react';

export default function DataLoad({ rowsCount }) {
    const skeletons = useMemo(() => {
        let components = [];
        for (let i = 0; i < rowsCount; i++) {
            components.push(<Skeleton key={"sk-" + i} variant="text" />)
        }
        return components;
    }, [rowsCount]);

    return skeletons;
}