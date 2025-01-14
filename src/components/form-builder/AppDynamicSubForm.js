import React from 'react';
import { Formik, Field, FieldArray } from 'formik';
import {
    TextField,
    MenuItem,
    Button,
    Select,
    FormControl,
    InputLabel,
    Chip,
    Input,
} from '@material-ui/core';

const initialValues = {
    rows: [{ field1: '', field2: '', field3: [] }],
};

const AppDynamicSubForm = () => {
    const handleAddRow = (push) => {
        push({ field1: '', field2: '', field3: [] });
    };

    return (
        <Formik initialValues={initialValues} onSubmit={(values) => console.log(values)}>
            {({ values, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <FieldArray name="rows">
                        {({ push, remove }) => (
                            <div>
                                {values.rows.map((row, index) => (
                                    <div key={index}>
                                        <Field
                                            name={`rows[${index}].field1`}
                                            label="Field 1"
                                            as={TextField}
                                            fullWidth
                                        />
                                        <Field
                                            name={`rows[${index}].field2`}
                                            label="Field 2"
                                            as={TextField}
                                            fullWidth
                                        />
                                        <FormControl fullWidth>
                                            <InputLabel id={`rows-${index}-field3-label`}>Field 3</InputLabel>
                                            {/* <Field
                                                name={`rows[${index}].field3`}
                                                multiple
                                                component={Select}
                                                labelId={`rows-${index}-field3-label`}
                                                input={<Input id={`rows-${index}-field3`} />}
                                                renderValue={(selected) => (
                                                    <div>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={value} />
                                                        ))}
                                                    </div>
                                                )}
                                            >
                                                <MenuItem value="Option1">Option 1</MenuItem>
                                                <MenuItem value="Option2">Option 2</MenuItem>
                                                <MenuItem value="Option3">Option 3</MenuItem>
                                            </Field> */}
                                        </FormControl>
                                        <Button type="button" onClick={() => remove(index)}>
                                            Remove Row
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" onClick={() => handleAddRow(push)}>
                                    Add Row
                                </Button>
                            </div>
                        )}
                    </FieldArray>
                    <Button type="submit">Submit</Button>
                </form>
            )}
        </Formik>
    );
};

export default AppDynamicSubForm;
