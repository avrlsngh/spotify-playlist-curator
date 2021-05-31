import axios from 'axios';

export const fetchFeaturedPlaylist = (token) => {
    return(dispatch, getState) => {
        axios.get('https://api.spotify.com/v1/browse/featured-playlists', {
        params: {
            country: 'IN'
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
        }).then(data => {
            console.log('fetched data: ', data.data.playlists.items);
            dispatch({
                type: 'STORE_FETCH_PLAYLIST',
                payload: data.data.playlists.items
            })
        })
    }
}


export const updateLocalPlaylist = (item, mode) => {
    return(dispatch, getState) => {
        if(mode === 'single'){
            let localPlaylist = getState().userReducer.localPlaylist;
            localPlaylist.push(item);
            dispatch({
                type: 'STORE_LOCAL_PLAYLIST',
                payload: localPlaylist
            });
            window.sessionStorage.setItem('localPlaylist', JSON.stringify(localPlaylist));
        }
        if(mode === 'bulk'){
            console.log('updating bulk')
            dispatch({
                type: 'STORE_LOCAL_PLAYLIST',
                payload: item
            })
            window.sessionStorage.setItem('localPlaylist', JSON.stringify(item));
        }
        
    }
}

export const fetchLocalPlaylist = () => {
    return(dispatch) => {
        const localPlaylistCached = JSON.parse(window.sessionStorage.getItem('localPlaylist'));
        console.log('cached local playlist: ', localPlaylistCached);
        if(localPlaylistCached !== null && localPlaylistCached !== undefined){
            dispatch({
                type: 'STORE_LOCAL_PLAYLIST',
                payload: localPlaylistCached
            });
        } else {
            dispatch({
                type: 'STORE_LOCAL_PLAYLIST',
                payload: []
            });
        }

    }
}

export const updateFetchedPlaylist = (item, mode) => {
    return(dispatch, getState) => {
        if(mode === 'single'){
            let fetchedPlaylist = getState().userReducer.fetchedPlaylist;
            fetchedPlaylist.push(item);
            dispatch({
                type: 'STORE_FETCH_PLAYLIST',
                payload: fetchedPlaylist
            })
        }
        if(mode === 'bulk'){
            dispatch({
                type: 'STORE_FETCH_PLAYLIST',
                payload: item
            })
        }
        
    }
}