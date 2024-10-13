import { useState, useCallback } from "react";

interface FormErrors {
  [key: string]: string | undefined;
}

type Validator<T> = (name: string, value: string, values: T) => string | undefined;

export const useForm = <T extends { [key: string]: any }>(initialValues: T, validate: Validator<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = useCallback(
    (name: string, value: any) => {
      setValues((prevValues) => ({ ...prevValues, [name]: value }));
    },
    [setValues]
  );

  const handleBlur = useCallback(
    (name: string) => {
      const error = validate(name, values[name], values);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    },
    [validate, values]
  );

  const handleSubmit = (callback: () => void) => (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors: FormErrors = Object.keys(values).reduce((acc, key) => {
      const error = validate(key, values[key], values);
      if (error) acc[key] = error;
      return acc;
    }, {} as FormErrors);

    if (Object.keys(validationErrors).length === 0) {
      callback();
    } else {
      setErrors(validationErrors);
    }
  };

  return {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setErrors,
    setValues
  };
};