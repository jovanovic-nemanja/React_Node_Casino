import React, { Component } from "react"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,  DropdownItem,Col,Row,FormGroup,Label,Table} from "reactstrap"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../../history"
import { ChevronDown,  ChevronLeft,  ChevronRight} from "react-feather"
import { connect } from "react-redux"
import {getData,getTotal} from "../../../../redux/actions/reports/satta/bymarket"
import {pagenation_set,selectedStyle} from "../../../../configs/providerconfig"
import Select from "react-select"
import Datepicker from "../../../lib/datepicker"

const FilterComponent = props =>{
  let gameoptions = props.dataList.toptbl && props.dataList.toptbl.gameoptions && props.dataList.toptbl.gameoptions.length > 0 ? props.dataList.toptbl.gameoptions : [];

  return (
    <Row className="mb-1">
      <Col  md='6' sm='12' xs='12'>
        <FormGroup>
          <Label for="Registration Date">Select Date</Label> 
          <Datepicker  onChange={date => { props.datechange(date,"dates") }} />
        </FormGroup>
      </Col>
       
      <Col md='3' sm='6' xs='12'>
        <FormGroup>
          <Label for="user">Martkets</Label>
          <Select className="React" classNamePrefix="select" name="game" 
            options={gameoptions}
            value={gameoptions.find(obj => obj.value === props.filters.bazaarid)}
            onChange={e => props.handleFilter(e.value,"bazaarid")}
          />
        </FormGroup>
      </Col>
      
      </Row>
  )
}

const CustomHeader = props => {
  let {totalRecords,sortIndex} = props.dataList;
  return (
    <div className='p-1 pt-2 pb-2'>
    <Row>
      <Col md="12">
      <Table bordered responsive>
      <thead>
          <tr>
            <th>Currency</th>
            <th>Total BET </th>
            <th>Total Win</th>
            <th>Total Void</th>
            <th>Total rollback</th>
            <th>Total GGr</th>
            <th>Real Players</th>
          </tr>
        </thead>
        <tbody> 
          <tr>
            <td>INR</td>
            <td>
            {props.dataList.toptbl ? props.dataList.toptbl.bet : 0}
            </td>
            <td>
            {props.dataList.toptbl ? props.dataList.toptbl.win : 0}
            </td>
            <td>
            {props.dataList.toptbl ? props.dataList.toptbl.void : 0}
            </td>
            <td>
            {props.dataList.toptbl ? props.dataList.toptbl.rollback : 0}
            </td>
            <td>
            {props.dataList.toptbl ? props.dataList.toptbl.GGR : 0}
            </td>
            <td>
            {props.dataList.toptbl ? props.dataList.toptbl.realplayerscount : 0}
            </td>
          </tr>
        </tbody>
      </Table>
      </Col>
      <Col xs='6' className='justify-content-start align-items-center flex' md="3">
        <UncontrolledDropdown className="data-list-rows-dropdown d-block ">
          <DropdownToggle color="" className="sort-dropdown">
            <span className="align-middle mx-50">
              {`${sortIndex[0]} - ${sortIndex[1]} of ${totalRecords}`}
            </span>
          <ChevronDown size={15} />
          </DropdownToggle>
          <DropdownMenu tag="div" right>
          {
            pagenation_set.map((item,i)=>(
              <DropdownItem tag="a" key={i} onClick={() => props.handleRowsPerPage(item)}>{item} </DropdownItem>
            ))
          }
        </DropdownMenu>
        </UncontrolledDropdown>
      </Col>
    </Row>
  </div>
  )
}

class ListViewConfig extends Component {
    state = {
        data: [],
        columns: [
          {
            name : "Martketname",
            selector : "bazaarname",
            sortable: true,
            minWidth: "150px",
           
          },
          {
            name : "Currency",
            selector : "Currency",
            sortable: true,
            minWidth: "100px",
            cell : row =>(
              <>
              {row.Currency? row.Currency : "INR"}
            </>
            )
          },
          {
            name : "WIN",
            selector : "WIN",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "BET",
            selector : "BET",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "Void",
            selector : "void",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "rollback",
            selector : "rollback",
            sortable: true,
            minWidth: "100px",
          },
          {
            name : "GGR",
            selector : "GGR",
            sortable: true,
            minWidth: "100px",
          },
         
        ],
        filters : {
          dates:{
            start : (new Date()),
            end : new Date(new Date().valueOf() + 60 * 60 * 1000 * 24)
          },
          bazaarid : "",
        },
    }

    componentDidMount(){
      this.props.getTotal(this.state.filters)
      this.props.getData(this.props.parsedFilter,this.state.filters)
    }

    handlePagination = page => {
      let { parsedFilter, getData } = this.props;
      let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : pagenation_set[0];
      let urlPrefix =`${history.location.pathname}`;
      history.push( `${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`);
      var params = { page: page.selected + 1, perPage: perPage };
      getData(params,this.state.filters);
    }

    componentDidUpdate(preveProps,prevState){
      if(preveProps.dataList !== this.props.dataList){
        let datalist = this.props.dataList;
        this.setState({
          data : datalist.data,
          totalPages: datalist.totalPages,
        })
      }
    }

    handleRowsPerPage = value => {
      let { parsedFilter, getData } = this.props
      let page = parsedFilter.page !== undefined ? parsedFilter.page : 1;
      history.push(`${history.location.pathname}?page=${page}&perPage=${value}`)
      var params = { page: page, perPage: value };
      getData(params,this.state.filters);
    }

    handleFilter = (value,bool) => {
      let filters = this.state.filters;
      filters[bool] = value;
      this.setState({filters : filters});
      this.props.getData(this.props.parsedFilter,filters);
      this.props.getTotal(this.state.filters);

    }

    datechange = (value) =>{
      let filters = this.state.filters;
      filters["dates"] = value;
      this.setState({filters : filters});
      this.props.getTotal(filters);
      this.props.getData(this.props.parsedFilter,filters);
    }
  render() {
    let { columns,data,totalPages} = this.state
    return (
      <>
      <FilterComponent 
          handleFilter={this.handleFilter}
          dataList={this.props.dataList}
          datechange={this.datechange}
          filters = {this.state.filters}
        />
      <div id="admindata_table" className={`data-list list-view`}>
        <DataTable
          columns={columns}
          data={data}
          pagination
          paginationServer
          paginationComponent={() => (
              <ReactPaginate
                previousLabel={<ChevronLeft size={15} />}
                nextLabel={<ChevronRight size={15} />}
                breakLabel="..."
                breakClassName="break-me"
                pageCount={totalPages}
                containerClassName="vx-pagination separated-pagination pagination-end pagination-sm mb-0 mt-2"
                activeClassName="active"
                forcePage={   this.props.parsedFilter.page? parseInt(this.props.parsedFilter.page - 1): 0}
                onPageChange={page => this.handlePagination(page)}
              />
          )}
          noHeader
          subHeader
          responsive
          pointerOnHover
          selectableRowsHighlight
          customStyles={selectedStyle}
          subHeaderComponent={
            <CustomHeader
                handleRowsPerPage={this.handleRowsPerPage}
                dataList={this.props.dataList}
              />
          }
          sortIcon={<ChevronDown />}
        />
      </div>
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    dataList: state.Reports.SattaMarkets
  }
}

export default connect(mapStateToProps, {getData,getTotal})(ListViewConfig)
