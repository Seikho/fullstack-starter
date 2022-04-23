import './style/color.scss'
import './app.scss'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { store, withState } from './state'
import { Provider } from 'react-redux'
import { Home } from './page/home'
import { BrowserRouter as Router, Route, Switch, Redirect, RouteProps } from 'react-router-dom'
import { Layout, Logout } from './layout'
import { Success } from './page/home/Success'

export const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Switch>
            <Public path="/success" component={Success} />
            <Private path="/profile" component={() => <div>Profile</div>} />
            <Private path="/logout" component={Logout} />
            <Public path={['/', '/home']} exact={true} component={Home} />
            <Public component={Home} />
          </Switch>
        </Layout>
      </Router>
    </Provider>
  )
}

const Private: React.FC<RouteProps> = withState<{ isLoggedIn: boolean }, RouteProps>(
  ({ user }) => ({ isLoggedIn: user.loggedIn }),
  (props) => {
    if (!props.isLoggedIn) return <Redirect to="/" />
    return <Public {...props} />
  }
)

const Public: React.FC<RouteProps> = (props) => {
  const nextProps = { ...props, component: undefined }
  return <Route {...nextProps}>{props.component}</Route>
}

const root = document.querySelector('#app')
ReactDOM.render(<App />, root)
