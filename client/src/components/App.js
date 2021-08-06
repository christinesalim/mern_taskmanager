import { Router, Route } from 'react-router-dom';
import Auth from './Auth';
import Home from './Home';
import TaskManager from './taskmanager/TaskManager';
import Header from './Header';
import history from '../history';

function App() {
  return (
    <div className="ui container">
      <Router history={history}>
        <div>
          <Header />
          <Route path="/" exact component={Home} />
          <Route path="/auth" exact component={Auth} />
          <Route path="/taskManager" exact component={TaskManager} />         
        </div>
      </Router>
    </div>
  );
}

export default App;
