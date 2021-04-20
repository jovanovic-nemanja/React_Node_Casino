import React, { Component } from 'react'
import { connect } from 'react-redux'
import DataTable from "react-data-table-component"
import {transactionHistoryLoad} from "../../../redux/actions/profileinfo/index"
import DatePicker from "../../lib/datepicker"
import {Input} from "reactstrap"
import Moment from 'react-moment';
Moment.globalFormat = 'YYYY/MM/DD hh:mm:ss';

const CustomHeader = props => {
  return (
    <div className="position-relative mb-1">
      <DatePicker
        onChange={date => {  props.setDate([date.start,date.end]) }}
      />
    </div>
  )
}

export class child extends Component {
  state = {
    columns: [
      {
        name: "amounttype",
        selector: "wallettype",
        minWidth:  "100px",
        sortable: true,
      },
      {
        name: "amount",
        selector: "amount",
        minWidth:  "100px",
        sortable: true,
      },
      {
        name: "status",
        selector: "status",
        minWidth:  "100px",
        sortable: true
      },
      {
        name: "Comment",
        selector: "type",
        sortable: true,
        minWidth:  "100px",
        cell : row =>(
          <div>
            <Input type="textarea" value={row.comment ? row.comment : "comment"} disabled={true} />
          </div>
        )
      },
      {
        name: "paymentType",
        minWidth:  "100px",
        selector: "type",
        sortable: true,
      },
      // {
      //   name: "Bank Name",
      //   minWidth:  "100px",
      //   selector: "ps_name",
      //   sortable: true,
      // },
      {
        minWidth:  "100px",
        name: "lastbalance",
        selector: "lastbalance",
        sortable: true,
      },
      {
        name: "updatedbalance",
        minWidth:  "100px",
        selector: "updatedbalance",
        sortable: true,
      },
      {
        name: "createDate",
        minWidth:  "100px",
        selector: "createDate",
        sortable: true,
        cell: row => (
            <span>
              <Moment  date={(new Date(row.createDate))} />
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
    this.props.transactionHistoryLoad( { email:this.props.user.email,start: this.state.date[0],end: this.state.date[1],})
  }
  
  render() {
    let { columns} = this.state;
    let data = this.props.depositdata
    return (
      <div id="admindata_table" >
        <CustomHeader date={this.state.date} setDate={(e)=>this.props.transactionHistoryLoad({email:this.props.user.email,start:e[0],end: e[1]})} />
        <DataTable data={data} columns={columns}  noHeader      pagination paginationPerPage={6} paginationRowsPerPageOptions={[6]} />
      </div>
    )

  }
}

const mapStateToProps = (state) => ({
  depositdata : state.profileinfo.wallet_deposit.data
})

const mapDispatchToProps = {
  transactionHistoryLoad
}

export default connect(mapStateToProps, mapDispatchToProps)(child)
