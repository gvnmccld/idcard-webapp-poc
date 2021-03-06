import React from 'react';
import ReactDom from 'react-dom';
import '../css/style.scss';
import Main from './components/Main.jsx';
import Configure from './components/Configure.jsx';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render () {
        return (
            <Router>
                <Switch>
                    <Route path='/config' component={Configure} />
                    <Route path='/' component={Main} />
                </Switch>
            </Router>
        )
    }
}

ReactDom.render(
  <App />,
  document.getElementById('root')
);