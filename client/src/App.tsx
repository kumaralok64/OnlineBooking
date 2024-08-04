import "./global.css"
import { Route,Routes } from 'react-router-dom'
import { Home ,HallRegis,BookTicket, UpdateHall, Layout, Sucess, Cancel} from './_root/pages'
import AuthLayout from "./_auth/authLayout"
import RootLayout from "./_root/rootLayout"
import { UserSignInForm , UserSignUpForm , UserPassword } from "./_auth/user"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  
import OwnerSignIn from "./_auth/Owner/OwnerSignIn"

const App = () => {
  return (
    <main className='flex h-screen'>
 <ToastContainer
      position="top-left"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      
/>
    <Routes>
{/* public routes */}
<Route element={ <AuthLayout />}>
<Route path='/User/Sign-in' element ={<UserSignInForm/>}/>
<Route path='/User/Sign-Up' element ={<UserSignUpForm/>}/>
<Route path='/User/Password' element ={<UserPassword/>} />
<Route path="/Owner/Sign-In" element={<OwnerSignIn/>} />
</Route>


{/* private routes */}
<Route element={<RootLayout />}>
<Route path="/" element={<Home/>}/>
<Route path="/Regis-Hall" element={<HallRegis/>}/>
<Route path="/Book-Ticket/:movieName" element={<BookTicket/>}/>
<Route path ="/UpdateHall/:id" element ={< UpdateHall/>} />
<Route path="/Hall-layout/:id/:movieName/:date/:time/:price/:hallName/:hallLoc" element={<Layout/>}/>
<Route path="/success" element={<Sucess/>}/>
<Route path="/cancel" element={<Cancel/>}/>
</Route>
    </Routes>      
    </main>
  )
}

export default App

