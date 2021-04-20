import React, { Component } from 'react'
import { connect } from 'react-redux'
import {TabContent, TabPane, Nav, NavItem, NavLink} from "reactstrap"
import classnames from "classnames"
import Mybets from "./mybets"
import Satta from "./satta"

export class index extends Component {
    state = {
        active: "1"
      }
    
      toggle = tab => {
        if (this.state.active !== tab) {
          this.setState({ active: tab })
        }
      }
    render() {
        return (
            <div>
                <Nav tabs className="nav-fill">
                                       
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.active === "1" })} onClick={() => {this.toggle("1") }} >
                            MyBets
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.active === "2" })} onClick={() => {this.toggle("2") }}>
                            Satta
                        </NavLink>
                    </NavItem>
                </Nav>
            <TabContent activeTab={this.state.active}>
               
                <TabPane tabId="1">
                    <Mybets user= {this.props.user} />
                </TabPane>
                <TabPane tabId="2">
                    <Satta user= {this.props.user} />
                </TabPane>                
            </TabContent>
        </div>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
