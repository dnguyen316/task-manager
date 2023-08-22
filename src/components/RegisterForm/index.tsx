import useForm from "hooks/useForm";
import { useDispatch } from "react-redux";
import UserServices from "services/userServices";
import UserActions from 'redux/actions/userAction'

export interface RegisterFormType {
  email: string;
  password: string;
}

const initialRegisterFormState: RegisterFormType = {
  email: '',
  password: '',
};

export interface IRegisterFormProps {
  onToggleForm: () => void;
}

const RegisterForm = (props: IRegisterFormProps) => {
  
  const dispatch = useDispatch();
  const { onToggleForm } = props
  const { formData, handleChangeFormData : handleChange} = useForm(initialRegisterFormState)

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Register User to Firebase
    try{
      dispatch(UserActions.register(true));
      const newUser = await UserServices.registerUser({
        email: formData.email,
        password: formData.password
      });
  
      if(newUser) {
        dispatch(UserActions.registerSuccess());
      }
    }catch(error) {
      dispatch(UserActions.register(false));
      throw error;
    }
  };

  return (
    <>
    <div>
      <form className="space-y-6" onSubmit={handleRegister}>
        <div>
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="user@email.com"
            onChange={handleChange}
            required
          />
          <span className='text-red-500 mt-2 hidden'>Error Message</span>
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-lg font-medium text-gray-900">Password</label>
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="••••••••"
            onChange={handleChange}
            required
          />
          <span className='text-red-500 mt-2 hidden'>Error Message</span>
        </div>
        <button className='button w-full' type='submit'>
          Register
        </button>
      </form>
      <div className="text-base font-medium text-gray-500 mt-4">
        <button onClick={onToggleForm} className="text-sky-500 text-center  hover:underline">Back to Login</button>
      </div>
    </div>
    </>
  );
}

export default RegisterForm;