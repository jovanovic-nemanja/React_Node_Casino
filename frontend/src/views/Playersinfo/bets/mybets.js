import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Col,Row,Badge,Label} from "reactstrap"
import DataTable from "react-data-table-component"
import {reports_email_load} from "../../../redux/actions/profileinfo/index"
import Datepicker from "../../lib/datepicker";

const CustomHeader = props => {
  return (
      <Row className="font-weight-bold">
          <Col sm="12" md="12" className="mb-1">
            <Datepicker onChange={date => { props.setDate([date.start,date.end]) }} />
        </Col>
        {
          props.result ? 
          <>
            <Col sm="12" md="3">
              <div>
                Total Deposit
              </div>
              <Label>
                {props.result.totaldeposit}
              </Label>
            </Col>
            <Col sm="12" md="3">
              <div>
                Total Bet
              </div>
              <Label>
                {props.result.totalbet}
              </Label>
            </Col>
            <Col sm="12" md="3">
              <div>
                Total Win
              </div>
              <Label>
              {props.result.totalwin}
              </Label>
            </Col>
            <Col sm="12" md="3">
              <div>
              Net balance 
              </div>
              <Label>
              {props.result.currentwalletbalance}
              </Label>
            </Col>
          </>
          :null
        }
      </Row>
  )
}

export class child extends Component {
  state = {
    columns: [
        {
            name: "PROVIDERID",
            selector: "PROVIDERID",
            sortable: true
          },
          {
            name: "NAME",
            selector: "NAME",
            sortable: true
          },
          {
            name: "Previous Balance",
            selector: "AMOUNT",
            sortable: true,
            cell: row => (
                <span>
                  {row.betting.prevbalance ? row.betting.prevbalance.toFixed(0) : "0"}
                </span>
            )
          },
          {
            name: "AMOUNT",
            selector: "AMOUNT",
            sortable: true,
            cell: row => (
                <span>
                  {  row.AMOUNT ? row.TYPE==='BET' ?  "-"+ row.AMOUNT.toFixed(0) : row.AMOUNT.toFixed(0) : "0"}
                </span>
            )
          },
          {
            name: "Net  Balance",
            selector: "AMOUNT",
            sortable: true,
            cell: row => (
                <span>
                  {row.betting.prevbalance ? row.TYPE==='BET' ? (row.betting.prevbalance - row.AMOUNT).toFixed(0) : (row.betting.prevbalance + row.AMOUNT).toFixed(0)  : "0"}
                </span>
            )
          },
          {
            name: "currency",
            selector: "currency",
            sortable: true,
            cell: row => (
              <Badge pill color = "light-success">
                INR
              </Badge>
            )
          },
          {
            name: "TYPE",
            selector: "TYPE",
            sortable: true,
            cell: row => (
              <Badge pill color={row.TYPE==='BET'?'danger':'success'}>{row.TYPE}</Badge>
            )
          },
          {
            name: "DATE",
            selector: "DATE",
            sortable: true,
            cell: row => (
              <span>
                {(new Date(row.DATE)).toLocaleString((new Date()).getTimezoneOffset(),{hour12 : false}).replace(",", "")}
              </span>
            )
          },
    ],
    value: "",
    filteredData: [],
    date : [
      new Date(),
      new Date(new Date().valueOf() + 24 * 60 * 60 * 1000),
    ]
  }

    componentDidMount(){
        this.props.reports_email_load( { email:this.props.user.email,start: this.state.date[0],end: this.state.date[1],})
    }

  
  render() {

    let { columns} = this.state;
    let {data,result} = this.props.mybets;
    return (
        <div id="admindata_table"  className={`data-list list-view`} >
          <CustomHeader 
            date={this.state.date}
            setDate={(e)=>this.props.reports_email_load({email:this.props.user.email,start:e[0],end: e[1]})}
            result={result}
          />
          <DataTable data={data} columns={columns} 
          noHeader
          pagination
          paginationPerPage={4}
          paginationRowsPerPageOptions={[5]}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  mybets : state.profileinfo.mybets
})

const mapDispatchToProps = {
    reports_email_load
}

export default connect(mapStateToProps, mapDispatchToProps)(child)
