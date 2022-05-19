import React from 'react';
import {Form} from 'react-bootstrap';

interface CustomRadioButtonProps {
    label: string;
    name: string;
    value: string;
    formik: any;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
                                                                 name,
                                                                 label,
                                                                 value,
                                                                 formik
                                                             }) => {
    return (
        <Form.Label htmlFor={value} role={'button'}>
            <Form.Check
                type={'radio'}
                className={'card-input-element d-none'}
                id={value}
                name={name}
                value={value}
                onChange={formik.handleChange}
            />
            <h5 className={'px-5 py-4 border' + (formik.values[name] === value ? ' border-dark' : '')}>
                {label}
            </h5>
        </Form.Label>
    );
};

export default CustomRadioButton;