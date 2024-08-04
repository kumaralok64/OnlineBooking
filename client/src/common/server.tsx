const backendDomain = "http://localhost:8000"

const UserApi = {
    backendDomain:{
        url:backendDomain
    },
    signUp :{
        url:`${backendDomain}/User/signUp`,
    },
    signIn:{
        url:`${backendDomain}/User/signIn`
    },
    logout:{
        url:`${backendDomain}/User/logout`
    },
    UserDetails:{
        url:`${backendDomain}/User/Details`
    },
    GoggleAuth:{
            url:`${backendDomain}/api/auth/google`
    },
    ResetPass:{
          url:`${backendDomain}/User/Password`
    },
    HallRegis:{
        url:`${backendDomain}/hall/Regis-hall`
    },
    imgChange:{
        url:`${backendDomain}/User/img`
    },
    updateDetails:{
        url:`${backendDomain}/hall/Update-Hall`
    },
    pushHallData:{
        url:`${backendDomain}/hall/push-Halldata`
    },
    hallDetails:{
         url:`${backendDomain}/hall/halls`
    },
    CreatePayment:{
         url:`${backendDomain}/CreatePayment/checkOut`,
        
    }
    
    
}


export default UserApi;