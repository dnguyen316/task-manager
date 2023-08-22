import { useState } from 'react';
import Logo from '../../assets/logo.jpg'
import UserServices from 'services/userServices';
import { User } from 'models/types/User';
import { useDispatch, useSelector } from 'react-redux';
import UserActions from 'redux/actions/userAction';
import useForm from 'hooks/useForm';
import RegisterForm from 'components/RegisterForm';
import { RootState } from 'redux/store';
import Loading from 'components/Loading';

export interface LoginFormType {
  email: string;
  password: string;
}

const initialLoginFormState: LoginFormType = {
  email: '',
  password: '',
};

function LoginForm() {

  const { formData, handleChangeFormData : handleChange} = useForm(initialLoginFormState)

  const dispatch = useDispatch();

  const [isRegister, setIsRegister] = useState(false);
  const { isLoading } = useSelector((state: RootState) => state.userReducer);

  const getGetUserInfo = async () => {
    try {
      const userInfo: User | unknown = await UserServices.login(formData);

      if(userInfo && Object.keys(userInfo).length > 0) {
        dispatch(UserActions.loginSuccess(userInfo));
        UserServices.saveCurrentUser(userInfo, process.env.REACT_APP_ENCRYPTION_KEY || '');
      } else {
  
      }
    }catch(err) {
      console.log("~err",err)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getGetUserInfo()
  };

  const handleToggleForm = () => {
    setIsRegister(!isRegister)
  }

  return (
      <>
      {isLoading && <Loading/>} 
      <div className='bg-sky-50 w-full h-full'>
        <div className="bg-white w-[400px] shadow-md rounded-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-8">
          <div className='flex items-center justify-center flex-col'>
            <img
              src={Logo}
              className='w-[120px] rounded-full'
            />
            <div className='font-sans font-bold text-2xl hidden md:block'>
              Hello, Again!
            </div>
          </div>
          <div className="px-6 py-6 lg:px-8">
          {
            isRegister ? (
              <RegisterForm onToggleForm={handleToggleForm}/>
            ) : (
            <form className="space-y-6" action="#" onSubmit={handleSubmit}>
              <div>
                  <label htmlFor="email" className="form-label">Email</label>
                  <input onChange={handleChange} type="email" name="email" className="form-input" placeholder="user@email.com" required/>
                  <span className='text-red-500 mt-2 hidden'>Error Mesage</span>
              </div>
              <div>
                  <label htmlFor="password" className="form-label">Password</label>
                  <input onChange={handleChange} type="password" name="password" className="form-input" placeholder="••••••••" required/>
                  <span className='text-red-500 mt-2 hidden'>Error Mesage</span>
              </div>
              <button className='button w-full' type='submit'>
                Login
              </button>
              <div className="text-base font-medium text-gray-500 ">
                Not registered? <a href="#" onClick={handleToggleForm} className="text-sky-500 text-center hover:underline ">Create account</a>
              </div>
            </form>
            )
          }
          </div>
        </div>
      </div>
      </>
  )
}

export default LoginForm