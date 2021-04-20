import React from "react"
import {TabContent,TabPane,Nav,NavItem,NavLink,Badge,Col,Table} from "reactstrap"
import classnames from "classnames"
import Breadcrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb"
import Bets from "./bets"
import Profile from "./profile"
import Wallet from "./wallet"
import MyWallet from "./MyWallet"
import {playerid} from "../../configs/providerconfig"
import {prefix,appprefix} from "../../authServices/rootconfig"
import WalletHistory from "./WalletHistory"

class TabsBasic extends React.Component {
  state = {
    activeTab: "1",
    active: "1",
    allData : this.props.location.state,
  }

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab })
    }
  }

  toggle = tab => {
    if (this.state.active !== tab) {
      this.setState({ active: tab })
    }
  }

  render() {
    let row = this.state.allData;
    return (
      <React.Fragment>
        <Breadcrumbs breadCrumbTitle="Players" breadCrumbParent="Players" breadCrumbParent2={this.state.allData.username} />
          <Col md="12" className="">
            <Table responsive bordered >
              <thead >
                <tr>
                  <th>UserID </th>
                  <th>First Name </th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Status</th>
                  <th>balance</th>
                  <th>bonusbalance</th>
                </tr>
              </thead>
              <tbody>
                  <tr >
                    <td>{row.signup_device ?appprefix : prefix}{row.pid}</td>
                    <td>{row.firstname}</td>
                    <td>{row.lastname}</td>
                    <td>{row.email}</td>
                    <td>{row.username}</td>
                    <td><Badge
                      color={ row.status === "allow" ? "light-success" : row.status === "pending" ? "light-warning" : "light-danger"} pill>
                      {row.status}
                    </Badge>
                    </td>
                    <td>{ row.balance ? parseFloat(row.balance).toFixed(0) : "0" }</td>
                    <td>{ row.bonusbalance ? parseFloat(row.bonusbalance).toFixed(0) : "0" }</td>
                  </tr>
              
              </tbody>
              </Table> 
          
          </Col>
            <Nav tabs className="nav-justified">
              {
                this.state.allData.permission === playerid ?
                  <>
                 
                  <NavItem>
                    <NavLink className={classnames({active: this.state.active === "4"})} onClick={() => {this.toggle("4")}}>
                      Wallet History
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className={classnames({active: this.state.active === "2"})} onClick={() => {this.toggle("2")}}>
                      Fund Request
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className={classnames({active: this.state.active === "3"})} onClick={() => {this.toggle("3")}}>
                      Betting History
                    </NavLink>
                  </NavItem> 
                  </> :
                  <>
                  <NavItem>
                    <NavLink className={classnames({active: this.state.active === "1"})} onClick={() => {this.toggle("1")}}>
                      My wallet
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className={classnames({active: this.state.active === "4"})} onClick={() => {this.toggle("4")}}>
                      Profile
                    </NavLink>
                  </NavItem>
                </>
              }
            </Nav>
            <div className="playerinfor-style">
              <TabContent  activeTab={this.state.active } className="h-100">
              {
                this.state.allData.permission === playerid ?
                  <>
                  
                    <TabPane tabId="2" className="h-100">
                      <Wallet user={this.props.location.state} />
                    </TabPane>
                    <TabPane tabId="3" className="h-100">
                      <Bets  user={this.props.location.state}/>
                    </TabPane>
                    <TabPane tabId="4" className="h-100">
                      <WalletHistory  user={this.props.location.state}/>
                    </TabPane>
                  </> :
                  <>
                  <TabPane tabId="1" className="h-100">
                    <MyWallet  user={this.props.location.state}/>
                  </TabPane>
                  <TabPane tabId="4">
                    <Profile user={this.props.location.state} />
                  </TabPane>
                  </>
              }
              </TabContent>

            </div>
      </React.Fragment>
    )
  }
}
export default TabsBasic
