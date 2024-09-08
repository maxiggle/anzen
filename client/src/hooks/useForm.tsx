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
  const [errors, setErrors] = useState<T>({} as T);

  const setFormValue = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    console.log({ name, value });

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
    console.log("Called");

    try {
      setIsSubmitting(true);
      const validationErrors = validateForm();

      console.log(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors as T);
        setIsSubmitting(false);
        return;
      }
      console.log("Calling action x");

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
    clearErrors: () => setErrors({} as T),
  };
}
export default useForm;
