const initState = {
    isLoggedIn: false,
    authToken: null,
}

const authReducer = (state = initState, action) => {
    switch(action.type){
        case 'STORE_AUTH_TOKEN':
            return{
                ...state,
                authToken: action.payload,
                isLoggedIn: true
            }
        case 'SET_AUTH_FALSE':
            return{
                ...state,
                authToken: null,
                isLoggedIn: false
            }
        default:
            return state
    }
}


export default authReducer;