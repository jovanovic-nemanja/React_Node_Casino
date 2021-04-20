import React from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ListViewConfig from "./children"
import queryString from "query-string"
class MenuManager extends React.Component {
  
  render() {
    return (
      <React.Fragment>
        <Breadcrumbs breadCrumbTitle="Payment" breadCrumbParent="Payment Menu Menager" />
          <Row>
            <Col sm="12">
              <ListViewConfig parsedFilter={queryString.parse(this.props.location.search)}/>
            </Col>
          </Row>
      </React.Fragment>
    )
  }
}

export default MenuManager