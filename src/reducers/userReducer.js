const initState = {
    fetchedPlaylist: [],
    localPlaylist: [],
}

const userReducer = (state = initState, action) => {
    switch(action.type){
        case 'STORE_FETCH_PLAYLIST':
            return{
                ...state,
                fetchedPlaylist: action.payload
            }
        case 'STORE_LOCAL_PLAYLIST':
            return{
                ...state,
                localPlaylist: action.payload
            }
        default:
            return state
    }
}

export default userReducer