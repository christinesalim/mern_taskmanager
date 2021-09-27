import { Router, Route } from 'react-router-dom';
import Auth from './auth/auth';
import Home from './Home';
import TaskManager from './taskmanager/TaskManager';
import Header from './Header';
import history from '../history';
import { AuthStateProvider } from './firebase/firebaseContext';

//Setup routing for the app
function App() {

  return (
    <div className="ui container">
      <AuthStateProvider>
        <Router history={history}>
          <div>
            <Header />
            <Route path="/" exact component={Home} />
            <Route path="/auth" exact component={Auth} />
            <Route path="/taskManager" exact component={TaskManager} />
          </div>
        </Router>
      </AuthStateProvider>
    </div>
  );
}

export default App;
