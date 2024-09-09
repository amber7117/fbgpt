import './styles/App.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Register from './screens/Register';
import Login from './screens/Login';
import Connect from './screens/Connect';
import Manage from './screens/Manage';
import Dashboard from './screens/Dashboard';
import {Navigate} from 'react-router-dom';
import Process from './screens/Process';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/connect',
        element: <Connect />
    },
    {
        path: '/manage',
        element: <Manage />
    },
    {
        path: '/dashboard',
        element: <Dashboard />
    },
    {
        path: '/process',
        element: <Process />
    }
]);

const App = () => {
    return (
        <div className="App">
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
