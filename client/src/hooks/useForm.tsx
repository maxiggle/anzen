import { useState } from "react";

interface IProps<T extends Record<string, unknown>> {
  initialValues?: T;
  action?: (values: T) => void;
  success?: (values: T) => void;
  validator?: (values: T) => Record<string, unknown>;
}
function useForm<T extends Record<string, string>>({
  initialValues,
  action = () => {},
  success = () => {},
  validator = () => ({}),
}: IProps<T>) {
  const [values, setValues] = useState<T>((initialValues as T) || ({} as T));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const setFormValue = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const validateForm = () => {
    return validator(values);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      await action(values);
      success(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    errors,
    form: values,
    setFormValue,
    isSubmitting,
    submit: handleSubmit,
    clearErrors: () => setErrors({}),
  };
}
export default useForm;
