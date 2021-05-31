import React from 'react';
import { connect } from 'react-redux';
import {authenticateUser} from '../actions/authActions';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { fetchFeaturedPlaylist, updateLocalPlaylist, updateFetchedPlaylist, fetchLocalPlaylist } from '../actions/userActions';

const clientId = "3364dba816cc43059a7857442669a48c";
const redirectUri = "http://localhost:3000/";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
];

const grid = 8;

const getListStyle = () => ({
    background: '#1a1a1a',
    padding: grid,
    width: 480,
    borderRadius: 10,
    height: 720,
    overflow: 'scroll'
});

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? '#4d4d4d' : '#242424',
    borderRadius: 10,
    color: 'white',
    display: 'flex', justifyContent:'space-between',
    ...draggableStyle
});

class Home extends React.Component{
    reorderList = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

     moveItem = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);
    
        destClone.splice(droppableDestination.index, 0, removed);
    
        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;
    
        return result;
    };

    onDragEnd = result => {
        const { source, destination } = result;
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = this.reorderList(
                this.props[source.droppableId],
                source.index,
                destination.index
            );
            if (source.droppableId === 'localPlaylist') {
                this.props.updateLocalPlaylist(items, 'bulk');
            }
        } else {
            const result = this.moveItem(
                this.props[source.droppableId],
                this.props[destination.droppableId],
                source,
                destination
            );
            this.props.updateLocalPlaylist(result['localPlaylist'], 'bulk');
            this.props.updateFetchedPlaylist(result['fetchedPlaylist'], 'bulk');
        }
    };


    componentDidMount(){
        this.props.authenticateUser(window.location.hash);
        this.props.fetchLocalPlaylist();
    }

    render(){
        return(
            <React.Fragment>
                <h2 className="w-100 text-center mt-2" style={{color: '#1DB954'}}>Spotify Playlist Curator</h2>
        
            {this.props.isLoggedIn && this.props.fetchedPlaylist !== null ? (
                <div className="d-flex justify-content-around py-5 px-5">
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="fetchedPlaylist">
                        {(provided, snapshot) => (
                            <div className="d-flex flex-column">
                            <h4 className="text-white">Featured Playlists</h4>
                            <div
                                ref={provided.innerRef}
                                style={getListStyle()}>
                                {this.props.fetchedPlaylist.map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}>
                                                {item.description}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                            </div>
                        )}
                    </Droppable>
                    <Droppable droppableId="localPlaylist">
                        {(provided, snapshot) => (
                            <div className="d-flex flex-column"> 
                            <h4 className="text-white">Local Playlists</h4>
                            <div
                                ref={provided.innerRef}
                                style={getListStyle()}>
                                {this.props.localPlaylist.map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}>
                                                {item.description}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                </div>
            ) : (
                <div className="w-100 d-flex justify-content-center py-5 px-5">
                    <a variant="success" className="btn btn-success btn-lg rounded shadow" href={`https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&show_dialog=true`}>
                        Login With Spotify
                    </a>
                </div>
            )}
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        fetchedPlaylist: state.userReducer.fetchedPlaylist,
        localPlaylist: state.userReducer.localPlaylist,
        isLoggedIn: state.authReducer.isLoggedIn,
        authToken: state.authReducer.authToken,
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        authenticateUser: (hash) => dispatch(authenticateUser(hash)),
        fetchFeaturedPlaylist: (token) => dispatch(fetchFeaturedPlaylist(token)),
        updateLocalPlaylist: (item, mode) => dispatch(updateLocalPlaylist(item, mode)),
        updateFetchedPlaylist: (item, mode) => dispatch(updateFetchedPlaylist(item, mode)),
        fetchLocalPlaylist: () => dispatch(fetchLocalPlaylist())
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Home)