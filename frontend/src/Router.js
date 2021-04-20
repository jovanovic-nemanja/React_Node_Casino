import React, { Suspense, lazy } from "react"
import { Router, Switch, Route ,Redirect } from "react-router-dom"
import { history } from "./history"
import { connect } from "react-redux"
import Spinner from "./components/@vuexy/spinner/Loading-spinner"
import { ContextLayout } from "./utility/context/Layout"
import { session_checked, setSidebar } from "./redux/actions/auth/loginActions"
import {  fake_session,getSession } from "./redux/actions/auth/index"
import { ToastContainer } from "react-toastify"
import { LOGIN_URL  } from "./urls";
import {firstpage_load} from "./redux/actions/CMS/firstpage/index"

  const Login = lazy(() => import("./views/auth/login/Login"))
  const changepassword = lazy(()=>import("./views/auth/ChangePassword"))
  const Revenue = lazy(() => import("./views/dashboard/Revenue"))
  const AnalyTics = lazy(()=> import("./views/dashboard/analytics"));
  const players = lazy(()=> import("./views/players/players/players"));
  const PlayersInfo = lazy(()=> import("./views/Playersinfo"));
  const playersLimits = lazy(()=> import("./views/players/playersLimits/menumanager"));

  const FinanceShow = lazy(()=> import("./views/Playersinfo/finance"));
  const Users = lazy(()=> import("./views/users/users/users"));//users
  const newmanagepermission = lazy(() => import("./views/permission/"));

  const PokerGridAPI = lazy(() => import("./views/pokerGridAPI/"));
  const RoomManage = lazy(() => import("./views/roomManager/"));

  const error404 = lazy(() => import("./views/commingsoon/index"));

  const RouteConfig = ({ component: Component, fullLayout, ...rest }) => (
    <Route
    {...rest}
    render={props => {
      return (
        <ContextLayout.Consumer>
          {context => {
            let LayoutTag = fullLayout === true ? context.fullLayout : context.state.activeLayout === "horizontal" ? context.horizontalLayout : context.VerticalLayout
            return (
              <LayoutTag {...props} permission={"admin"}>
                <Suspense fallback={<Spinner />}>
                  <Component {...props} />
                </Suspense>
              </LayoutTag>
            )
          }}
        </ContextLayout.Consumer>
      )
    }}
  />
)

const mapstopss = (state)=>{
  return {
    login : state.auth.login
  }
}

const AppRoute = connect(mapstopss,null)(RouteConfig)

const RequireAuth = (data) => {
  if (!getSession()){
    fake_session();
    return <Redirect to={LOGIN_URL} />;
  }

  if(data.children){
    
    let items = data.children;
      for(var i in items){
        if( items[i] && items[i].props.path === data.location.pathname){
          return items.slice(0, items.length-1);
        }
      }
      return items.slice(items.length-1, data.children.length);
  }else{
    return false
    // return <Redirect to={LOGIN_URL} />;
  }
};


class AppRouter extends React.Component {

   componentWillMount(){
    let get_sess =  getSession();
    if(get_sess){
      this.props.setSidebar();
      this.props.firstpage_load();
      this.props.session_checked(get_sess);

    }
  }

  render(){
    return (  
      <Router history={history}>
        <Switch>
          <AppRoute path={LOGIN_URL} exact component={Login} fullLayout />
            <RequireAuth >
              <AppRoute path="/" exact component={Revenue}/>
              <AppRoute path="/dashboard/Analytics" exact  component={AnalyTics} />
              <AppRoute path="/chagepassword" component={changepassword} />
              <AppRoute path="/dashboard/Revenue" component={Revenue} />
              <AppRoute path="/Players/infor" component={PlayersInfo} />
              <AppRoute path="/Players/players" component={players} />
              <AppRoute path="/limits" component={playersLimits} />
              <AppRoute path="/finace/playershow" component={FinanceShow} />
              <AppRoute path="/pokerAPI" component={PokerGridAPI} />
              <AppRoute path="/roomManager" component={RoomManage} />

              <AppRoute path="/permission/manage" component={newmanagepermission} />
              
              <AppRoute path="/users/Users" component={Users} />
              
              <AppRoute component={error404} />
            </RequireAuth>
        </Switch>
        { this.props.loading ? <Spinner  /> : "" } 
        <ToastContainer />
      </Router>
    )
  }
}
const mapstops = (state)=>{
  return {
    sidebarLoadData : state.userslist.permission.sidebarLoadData,
    loading : state.auth.login.loading,
    user : state.auth.login.values

  }
}
export default connect(mapstops,{session_checked, setSidebar,firstpage_load})(AppRouter)