import React from 'react';
import './App.css';
import { Switch, Route } from "react-router-dom";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import Home from './screens/Home';


class App extends React.Component {
  render(){
    return (
      <div className="appContainer" style={{background: 'black', height: "100%"}}>
       <ToastsContainer
         store={ToastsStore}
         position={ToastsContainerPosition.TOP_RIGHT}
         lightBackground
       />
       <Switch>
         <Route exact path="/" component={Home} />
       </Switch>
      </div>
     );
  } 
}

export default App;
