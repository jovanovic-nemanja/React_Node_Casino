import React from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ListViewConfig from "./child"
import queryString from "query-string"
class Gamelist extends React.Component {
  
  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Players"
          breadCrumbParent="player List"
        />
        <Row>
          <Col sm="12">
          <ListViewConfig parsedFilter={queryString.parse(this.props.location.search)} bool={"WITHDRAWL"} />
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default Gamelist