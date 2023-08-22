import 'config/firebase';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Dashboard from 'components/Dashboard';
// import Loading from 'components/Loading';
// import useBoards from 'hooks/useBoards';
import LoginForm from 'components/LoginForm';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { useEffect } from 'react';
import UserServices from 'services/userServices';
import UserActions from 'redux/actions/userAction';

function App() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.userReducer);

  const dispatch = useDispatch()
  useEffect(() => {
    const currentUser = UserServices.getCurrentUser(process.env.REACT_APP_ENCRYPTION_KEY || '') || {};
    if(Object.keys(currentUser).length > 0) {
      dispatch(UserActions.loginSuccess(currentUser));
    }
  },[]);

  return (
    <div className='relative h-screen w-screen'>
      
      {isAuthenticated ? (
        <>
          <Header/>
          <Sidebar/>
          <Dashboard/>
        </>
      ) : (
        <LoginForm/>
      )
      }
    </div>
  )
}

export default App