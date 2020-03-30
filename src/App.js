import React, { Component } from "react";
import "./App.css";
import SignIn from "./pages/SignIn";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import UDashboard from "./components/UDashboard";

const PrivateRoute = ({ component: Component, ...rest }) => {
  console.log("rest", rest);
  return (
    <Route
      {...rest}
      render={props =>
        rest.isLoggedIn ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

const LoginRoute = ({ component: Component, ...rest }) => {
  console.log("Login rest" + JSON.stringify(rest));
  console.log("NEW WE CALL IT" + rest.checkLogin(2));
  return (
    <Route
      {...rest}
      render={props =>
        rest.isLoggedIn ? (
          <Redirect to="/home" />
        ) : (
          <Component {...rest} {...props} />
        )
      }
    />
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isAdmin: false
    };
  }

  checkAdmin = isAdmin => {
    this.setState({
      isAdmin
    });
  };

  logout = () => {
    localStorage.removeItem("user");
    this.setState({
      isLoggedIn: false
    });
  };

  checkLogin = (...e) => {
    const _user = localStorage.getItem("user");
    console.log("PARAMS " + e);
    console.log("CHECK LOGIN" + _user);

    if (_user !== null) {
      const res = JSON.parse(_user).roles.find(
        role => role.description == "ADMIN"
      );
      console.log("REEEEEEES " + JSON.stringify(res));
      console.log("RES -> " + res + " : " + (res == undefined));
      if (res != undefined)
        this.setState({
          isAdmin: true
        });
      else
        this.setState({
          isAdmin: false
        });
      this.setState({ isLoggedIn: true });
    }
  };

  render() {
    console.log("APP PROPS" + JSON.stringify(this.props.history));

    return (
      <div className="App">
        <Router>
          <Switch>
            <LoginRoute
              path="/"
              isLoggedIn={this.state.isLoggedIn}
              checkLogin={this.checkLogin}
              exact
              component={SignIn}
            />
            <PrivateRoute
              path="/home"
              logout={this.logout}
              checkAdmin={this.checkAdmin}
              component={this.state.isAdmin ? Dashboard : UDashboard}
              isLoggedIn={this.state.isLoggedIn}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
