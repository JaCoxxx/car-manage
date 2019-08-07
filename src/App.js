import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import AllComponents from './components'
// import AllCommons from './commons'
import Intercept from './commons/Widget/Intercept'

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          {/* <Route exact path="/" render={() => <Redirect to="/app/index" push></Redirect>} /> */}
          <Route exact path='/' render={() => <Redirect to="/main/index" push></Redirect>} />  />
          <Route path="/main" component={AllComponents.Frontend} />
          <Route path="/app" component={Intercept} />
          <Route path="/404" component={AllComponents.NotFound} />
          <Route path="/login" component={AllComponents.Login} />
          <Route component={AllComponents.NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default App;
