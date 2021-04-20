import React, { Component } from "react"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import Sidebar from "./DataListSidebar"
import classnames from "classnames"
import {history } from "../../history"
import {connect } from "react-redux"
import {roomType} from "../../configs/providerconfig"
import { getData, deleteData, filterData, pagenationchange } from '../../redux/actions/pokerRoom/';
import {pagenation_set,selectedStyle,gender, Amount_Types} from "../../configs/providerconfig"
import { ChevronDown,  ChevronLeft,  ChevronRight,Plus, Edit, Trash} from "react-feather"
import {UncontrolledDropdown,  DropdownMenu,  DropdownToggle,  DropdownItem, Col,Row, Button} from "reactstrap"

const ActionsComponent = props => {
  return (
    <div className="data-list-action">
      <Edit  className="cursor-pointer mr-1" size={20} onClick={() => {return props.currentData(props.row) }} />
      <Trash  className="cursor-pointer mr-1" size={20} onClick={() => {return props.deleteData(props.row, props.props.parsedFilter) }} />
    </div>
  )
}

const CustomHeader = props => {
  return (
    <div className='p-1 pt-2 pb-2'>
      <Row>
        <Col md="3" xs='12' className='justify-content-start align-items-center flex'>
          <UncontrolledDropdown className="data-list-rows-dropdown d-block ">
            <DropdownToggle color="" className="sort-dropdown">
              <span className="align-middle mx-50">
                {`${props.index[0] ? props.index[0] : 0} - ${props.index[1] ? props.index[1] : 0} of ${props.total}`}
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
        
        <Col md="3">
        </Col>
        <Col md="3">
        </Col>

        <Col md="3" xs='12' className='justify-content-end align-items-center' style={{display:'flex'}}>
          <Button className="add-new-btn  mr-1" color="primary" onClick={() => props.handleSidebar(true, true)} outline>
            <Plus size={15} />
            <span className="align-middle">Create</span>
          </Button>
        </Col>
      </Row>
    </div>
  )
}

class ListViewConfig extends Component {
    static getDerivedStateFromProps(props, state) {
      if ( props.dataList.data.length !== state.data.length ||state.currentPage !== props.parsedFilter.page ) {
        return {
          data: props.dataList.data,
          allData: props.dataList.filteredData,
          totalPages: props.dataList.totalPages,
          currentPage: parseInt(props.parsedFilter.page) - 1,
          rowsPerPage: parseInt(props.parsedFilter.perPage),
          totalRecords: props.dataList.totalRecords,
          sortIndex: props.dataList.sortIndex
        }
      }
    return null;
  }

  state = {
      data: [],
      totalPages: 0,
      currentPage: 0,
      columns: [
        {
          name: "Room Name",
          selector: "roomName",
          sortable: true,
          minWidth: "50px",
          cell: row => (
            <>
              {row.roomName}
            </>
          )
        },
        {
          name : "Room Type",
          selector : "roomType",
          sortable: true,
          minWidth: "100px",
          cell : row =>(
            <>
              {roomType.filter((e) => {return e.value === row.roomType})[0].label}
            </>  
          )
        },
        {
          name: "Min Players",
          selector: "minplayers",
          sortable: true,
          minWidth: "20px"
        },
        {
            name: "Max Players",
            selector: "maxplayers",
            sortable: true,
            minWidth: "20px"
        },
        {
          name: "minBuyin",
          selector: "minbuyin",
          sortable: true,
          minWidth: "100px"
        },
        {
          name: "maxBuyin",
          selector: "maxbuyin",
          sortable: true,
          minWidth: "100px",
        },
        {
          name: "Small Blind",
          selector: "smallblind",
          sortable: true,
          minWidth: "100px",
        },
        {
          name: "Big Blind",
          selector: "bigblind",
          sortable: true,
          minWidth: "100px",
        },
        {
          name: "Actions",
          selector: "actions",
          sortable: true,
          minWidth: "100px",
          cell: row => (
            <ActionsComponent
              row={row}
              me={this.state}
              state = {this}
              selected={row}
              props={this.props}
              currentData={this.handleCurrentData}
              deleteData={this.props.deleteData}
            />
          )
        }
      ],
      allData: [],
      value: "",
      rowsPerPage: 10,
      currentData: null,
      selected: {},
      totalRecords: 0,
      sortIndex: [],
      sidebar: false,
      addNew: false,
      filters : {
        date : [new Date().toISOString()],
        username : "",
        id : "",
        region_name : "",
        email : "",
        firstname : "",
        lastname : "",
        address : "",
        gender : gender[0].value,
        birthday : [new Date().toISOString()],
        balance : "",
        permission : ""
      },
      modal: false,
      password1 : "",
      password2: "",
      selectedRows:[],
      type : '',
      amodal : false,
      amount : 0,
      comment : "",
      Amount_type : Amount_Types[0].value,
    }
  componentDidMount() {
    this.props.getData(this.props.parsedFilter,this.state.filters)
  }

  handleFilter = (value,bool) => {
    var filters = this.state.filters;
    filters[bool] = value;
    this.setState({ filters: filters });
    this.props.filterData(value,bool);
  }

  handleRowsPerPage = value => {
    let { parsedFilter, pagenationchange } = this.props;
    let page = parsedFilter.page ? parsedFilter.page : 1
    history.push(`${history.location.pathname}?page=${page}&perPage=${value}`);
    this.setState({ rowsPerPage: value })
    pagenationchange({ page: page, perPage: value })
  }

  handleSidebar = (boolean, addNew = false) => {
    this.setState({ sidebar: boolean })
    if (addNew === true) this.setState({ currentData: null, addNew: true })
  }

  handleCurrentData = obj => {
    this.setState({ currentData: obj })
    this.handleSidebar(true)
  }

  handlePagination = page => {
    let { parsedFilter, pagenationchange } = this.props
    let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 10
    let urlPrefix =history.location.pathname
    history.push(`${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`)
    pagenationchange({ page: page.selected + 1, perPage: perPage })
    this.setState({ currentPage: page.selected })
  }

  render() {
    let { columns,data,totalPages,rowsPerPage,currentData,sidebar,totalRecords,sortIndex} = this.state;
    return (
    <>
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
              forcePage={ this.props.parsedFilter.page ? parseInt(this.props.parsedFilter.page - 1) : 0 }
              onPageChange={page => this.handlePagination(page)}
            />
          )}
          noHeader
          subHeader
          responsive
          pointerOnHover
          selectableRows
          selectableRowsHighlight
          onSelectedRowsChange={data => this.setState({ selectedRows: data.selectedRows }) }
          customStyles={selectedStyle}
          subHeaderComponent={
            <CustomHeader
              handleFilter={this.handleFilter}
              handleRowsPerPage={this.handleRowsPerPage}
              rowsPerPage={rowsPerPage}
              total={totalRecords}
              handleSidebar={this.handleSidebar}
              me={this.state}
              index={sortIndex}
              multiblock={this.props.multiblockaction}
              parsedFilter={this.props.parsedFilter}
            />
          }
          sortIcon={<ChevronDown />}
        />

        <Sidebar
          show={sidebar}
          data={currentData}
          me={this.state}
          updateData={this.props.updateData}
          addData={this.props.addData}
          handleSidebar={this.handleSidebar}
          thumbView={this.props.thumbView}
          dataParams={this.props.parsedFilter}
          addNew={this.state.addNew}
        />
        <div className={classnames("data-list-overlay", {show: sidebar})}  onClick={() => this.handleSidebar(false, true)} />
      </div>
    </>
    )
  }
}

const mapStateToProps = state => {
  return {
    dataList: state.pokerRoom,
    permission : state.userslist.permission.permissiondata,
  }
}

export default connect(mapStateToProps, { getData, filterData, pagenationchange, deleteData})(ListViewConfig)