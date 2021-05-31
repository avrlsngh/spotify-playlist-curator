import axios from "axios"
import {fetchFeaturedPlaylist} from './userActions';

export const authenticateUser = (hash) => {
    return (dispatch) => {
        let hashString = '';
        let fetchPlaylist = false;
        let authToken = window.sessionStorage.getItem('spotifyAuthToken');
        let authTokenExpireTime = window.sessionStorage.getItem("spotifyAuthTokenExpireTime");
        console.log(authTokenExpireTime, authToken);
        if(authToken !== null && authToken !== undefined && authTokenExpireTime !== null && authTokenExpireTime !== undefined && authTokenExpireTime !== 'Invalid Date'){
            const currentTime = new Date();
            const expireTime = new Date(authTokenExpireTime);
            console.log('time difference', expireTime - currentTime);
            if(expireTime - currentTime < 0){
                console.log('setting false');
                dispatch({
                    type: 'SET_AUTH_FALSE'
                });
                return;
            } else {
                dispatch({
                    type: 'STORE_AUTH_TOKEN',
                    payload: authToken
                });
                fetchPlaylist = true;
            }
        } else {
            console.log('not exists');
            window.sessionStorage.removeItem('spotifyAuthToken');
            window.sessionStorage.removeItem('spotifyAuthTokenExpireTime');
            hashString = hash.substring(1)
            .split("&")
            .reduce(function(initial, item) {
                if (item) {
                var parts = item.split("=");
                initial[parts[0]] = decodeURIComponent(parts[1]);
                }
                return initial;
            }, {});
            console.log("hashString: ", hashString);
            window.sessionStorage.setItem('spotifyAuthToken', hashString.access_token);
            authToken = hashString.access_token;
            let expireTime = new Date();
            expireTime.setSeconds(expireTime.getSeconds() + parseInt(hashString.expires_in));
            window.sessionStorage.setItem('spotifyAuthTokenExpireTime', expireTime);
            fetchPlaylist = true;
            dispatch({
                type: 'STORE_AUTH_TOKEN',
                payload: authToken
            });
        }
        // console.log("au")
        if(fetchPlaylist){
            
            axios.get('https://api.spotify.com/v1/browse/featured-playlists', {
            params: {
                country: 'IN'
            },
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
            }).then(data => {
                console.log('fetched data: ', data.data.playlists.items);
                dispatch({
                    type: 'STORE_FETCH_PLAYLIST',
                    payload: data.data.playlists.items
                })
            })
            // fetchFeaturedPlaylist(hashString.access_token);
            
            
        }
        
        window.location.hash = "";
    }
}