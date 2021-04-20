import React from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ListViewConfig from "../FirstPageGameListSetting/menumanagerchild"
import queryString from "query-string"
import {providerconfig} from "../../../configs/providerconfig"

class MenuManager extends React.Component {
  
  render() {
    
    return (
      <React.Fragment>
        <Breadcrumbs breadCrumbTitle="CMS" breadCrumbParent="FirstPage Casino Game list MANAGER" />
        <Row>
          <Col sm="12">
            <ListViewConfig parsedFilter={queryString.parse(this.props.location.search)} bool={providerconfig["CASINO/SLOTS"]}/>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default MenuManager