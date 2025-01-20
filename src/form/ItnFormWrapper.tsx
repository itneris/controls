import FormFieldsProvider from '..//providers/FormFieldsProvider/FormFieldsProvider';
import ItnForm from './ItnBaseForm';
import { ItnFormProps } from '../types/BaseFormProps';

function ItnFormWrapper<T>(props: ItnFormProps<T>) {
    return (
        <FormFieldsProvider>
            <ItnForm {...props} />
        </FormFieldsProvider>
    );
};

export default ItnFormWrapper;