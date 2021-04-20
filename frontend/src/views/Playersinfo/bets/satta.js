import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Badge } from "reactstrap"
import DataTable from "react-data-table-component"
import {satta_history_load} from "../../../redux/actions/profileinfo/index"
import {Bazaartype} from "../../../configs/providerconfig"
import DatePicker from "../../lib/datepicker"

const CustomHeader = props => {
  return (
    <div className="position-relative mb-1">
      <DatePicker
        onChange={date => { props.setDate([date.start,date.end]) }}
      />
    </div>
  )
}

export class child extends Component {
  state = {
    columns: [
      {
        name: "Betid",
        selector: "transactionid",
        sortable: true,
      }, 
      {
        name: "Bazaartype",
        selector: "BazaarType",
        sortable: true,
        cell: row => (
            <div>
              {Bazaartype[row.bazaaritem.bazaartype]}
            </div>
        )
      },
      {
        name: "BazzarName",
        selector: "BazzarName",
        sortable: true,
        cell: row => (
            <div>
              {row.bazaaritem.bazaarname}
            </div>
        )
      },
      {
        name: "Gamename",
        selector: "GameName",
        sortable: true,
        cell: row => (
          <div>
            {row.gameitem.name}
          </div>
        )
      },
      {
        name: "betnumber",
        selector: "betnumber",
        sortable: true,
      },  
      {
        name: "type",
        selector: "type",
        sortable: true,
      },  
      {
        name: "amount",
        selector: "amount",
        sortable: true,
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
        name: "status",
        selector: "status",
        sortable: true,
        cell : row =>(
          <Badge pill color = { row.status === "1" ? "light-warning" :  row.status === "2" ?  "light-success" : "light-danger"}>
            { row.status === "1" ? "Pending" :  row.status === "2" ?  "win" : "lost"}
          </Badge >
        )
      }, 
      {
        name: "DATE",
        selector: "DATE",
        sortable: true,
        cell: row => (
          <span>
            {(new Date(row.DATE)).toDateString()}
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
    this.props.satta_history_load( { email:this.props.user.email,start: this.state.date[0],end: this.state.date[1],})
  }

  render() {
    let { columns} = this.state;
    let data = this.props.sattadata
    return (
      <div id="admindata_table" >
        <CustomHeader  date={this.state.date}
          setDate={(e)=>this.props.satta_history_load({email:this.props.user.email,start:e[0],end: e[1]})} />
        <DataTable data={data} columns={columns}  noHeader pagination />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  sattadata : state.profileinfo.Satta.data
})

const mapDispatchToProps = {
  satta_history_load
}

export default connect(mapStateToProps, mapDispatchToProps)(child)
