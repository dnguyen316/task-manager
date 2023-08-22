import { LoginFormType } from 'components/LoginForm';
import { RegisterFormType } from 'components/RegisterForm';
import { Board } from 'models/types/Board';
import { Task } from 'models/types/Task';
import { useEffect, useState } from 'react';

export type DataType = Task | Board | LoginFormType | RegisterFormType;

const initialFormData = {} as any;

const useForm = (data: DataType) => {
  const [formData, setFormData] = useState(initialFormData);

  const setFormDataWithSpecificFieldValue = (name: string, value: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!!data && Object.keys(data).length > 0) {
      setFormData(data);
    }
  }, [data]);

  const handleChangeFormData = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    // setFormData((prevData: any) => ({
    //   ...prevData,
    //   [name]: value,
    // }));
    setFormDataWithSpecificFieldValue(name, value);
  };

  return {
    formData,
    setFormData,
    handleChangeFormData,
    setFormDataWithSpecificFieldValue,
  };
};

export default useForm;
