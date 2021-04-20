import React, { Component } from 'react'
import { connect } from 'react-redux'
import DatePicker from "../../lib/datepicker"
import {get_accountStatement} from "../../../redux/actions/profileinfo"
import DataTable from "react-data-table-component"
import {Badge} from "reactstrap"
import Moment from 'react-moment';
Moment.globalFormat = 'YYYY/MM/DD hh:mm:ss';
export class index extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            columns: [
                {
                    name: "PROVIDERID",
                    selector: "PROVIDERID",
                    sortable: true,
                    minWidth:  "100px",
                },
                {
                    name: "TYPE",
                    selector: "TYPE",
                    sortable: true,
                    minWidth:  "100px",
                }, 
                {
                    name: "NAME",
                    selector: "NAME",
                    sortable: true,
                    minWidth:  "100px",
                },
                {
                    name: "roundid",
                    selector: "roundid",
                    sortable: true,
                    minWidth:  "100px",
                }, 
                {
                    name: "status",
                    selector: "status",
                    sortable: true,
                    minWidth:  "100px",
                    cell : row =>(
                        <Badge pill color={row.status==='BET' || row.status === "WITHDRAWl"?'danger':'success'}>{row.status}</Badge>
                    )
                }, 
                {
                    name: "credited",
                    selector: "credited",
                    sortable: true,
                    minWidth:  "50px",
                    cell : row =>(
                        <div>
                            {row.credited.toFixed(0)}
                        </div>
                    )
                }, 
                {
                    name: "debited",
                    selector: "debited",
                    sortable: true,
                    minWidth:  "50px",
                    cell : row =>(
                        <div>
                            {row.debited.toFixed(0)}
                        </div>
                    )
                }, 
                {
                    name: "commission",
                    selector: "commission",
                    sortable: true,
                    minWidth:  "50px",
                }, 
                {
                    name: "lastbalance",
                    selector: "lastbalance",
                    sortable: true,
                    minWidth:  "100px",
                    cell : row =>(
                        <div>
                            {row.lastbalance.toFixed(0)}
                        </div>
                    )
                }, 
                {
                    name: "updatedbalance",
                    selector: "updatedbalance",
                    sortable: true,
                    minWidth:  "100px",
                    cell : row =>(
                        <div>
                            {row.updatedbalance.toFixed(0)}
                        </div>
                    )
                }, 
                {
                    name: "updated",
                    selector: "updated",
                    sortable: true,
                    cell: row => (
                        <span>
                            <Moment  date={(new Date(row.updated))} />
                        </span>
                    )
                },
                
            ],
            date : {
                start : new Date(),
                end : new Date(new Date().valueOf() + 24 * 60 * 60 * 1000),
            }
        }
    }

    componentDidMount(){
        this.props.get_accountStatement(this.state.date,this.props.user)
    }

    setDate = async (e) =>{
        await this.setState({date :e});
        this.props.get_accountStatement(this.state.date,this.props.user);
    }
    
    render() {
        let datas = this.props.load_data;
        let columns = this.state.columns
        return (
            <div id="admindata_table" >
                <div className="mb-1">
                    <DatePicker  onChange={date => { this.setDate(date) }} />
                </div>
                <DataTable data={datas} columns={columns}  noHeader pagination
                paginationPerPage={9}
                paginationRowsPerPageOptions={[9]}
                />
          </div>
        )
    }
}

const mapStateToProps = (state) => ({
    load_data :  state.profileinfo.accountstatement.load
})

const mapDispatchToProps = {
    get_accountStatement
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
