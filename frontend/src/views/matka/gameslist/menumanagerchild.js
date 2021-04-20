import React, { Component } from "react"
import {  UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, Input, Col, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Form, Badge } from "reactstrap"
import {  ChevronDown, ChevronLeft, ChevronRight, Trash , Edit, Plus, Edit2 ,Award} from "react-feather"
import {  getData, filterData, menusave, menuupdate, menudelete ,pagenationchange,filesupload} from "../../../redux/actions/matka/games"
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import { connect } from "react-redux"
import Toggle from "react-toggle"
import {selectedStyle,pagenation_set, bazaartype, BazaarStringType,} from "../../../configs/providerconfig"
import {Root} from "../../../authServices/rootconfig"
import Demo from "../../lib/crop"
import Select from "react-select"
import makeAnimated from 'react-select/animated'

const animatedComponents = makeAnimated()

const ActionsComponent = props => {
  return (
    <div className="data-list-action">
      <Edit  className="cursor-pointer mr-1" size={20} onClick={()=>props.rowEdit(props.row)} />
      <Trash className="cursor-pointer mr-1" size={20} onClick={()=>props.rowDelete(props.row,props.parsedFilter,props.me.props.bool)} />
    </div>
  )
}

const CustomHeader = props => {
  return (
    <Row className="p-1">
    <Col xs="6" md="3">
      <UncontrolledDropdown className="data-list-rows-dropdown mt-1 d-block mb-1">
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
    <Col xs="6" md="2" className="mt-1 text-right">
       <Button
          className="add-new-btn"
          color="primary"
          onClick={() => props.handleSidebar(true)}
          outline>
          <Plus size={15} />
          <span className="align-middle">Add New</span>
        </Button>
    </Col>
  </Row>
  )
}

class Child extends Component {

  static getDerivedStateFromProps(props, state) {
    if ( props.dataList.data.length !== state.data.length || state.currentPage !== props.parsedFilter.page ) {
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
          
          name: "Bool",
          selector: "bool",
          sortable: false,
          minWidth: "100px",
        },
        {
          name: "image",
          selector: "image",
          sortable: false,
          minWidth: "220px",
          cell : params =>{ return (
            <img onClick={()=>this.ImgEdit(params)} src={ params.image ? params.image.length > 0 ? params.image.slice(0,5) === "https" ? params.image : Root.imageurl + params.image : "" : ""} height="100" width="150" alt={params.image} />
          )
          }
        },
        {
          name: "name",
          selector: "name",
          sortable: false,
          minWidth: "100px",
        },
        {
          name: "BazarType",
          selector: "BazarType",
          sortable: false,
          minWidth: "100px",
          cell : row => (
            <div>
             {
               row.bazaartype ? Object.keys(row.bazaartype).map((item,i)=>(
                 <div key={i}>
                   {
                     BazaarStringType[item]
                   }
                  </div>
               )) :null
             }
            </div>
          )
        },
        // {
          
        //   name: "Bid Price",
        //   selector: "bidPrice",
        //   sortable: false,
        //   minWidth: "100px",
        // },
        // {
        //   name: "Gain Price",
        //   selector: "gainPrice",
        //   sortable: false,
        //   minWidth: "20px",
        // },
        // {
        //   name: "Price Win",
        //   selector: "priceWin",
        //   sortable: false,
        //   minWidth: "20px",
        // },
        {
          name: "status",
          selector: "status",
          sortable: false,
          minWidth: "100px",
          cell: row => (
            <Badge color={ row.status ? "light-success" : "light-danger"}pill>
              {row.status ? "Enable" : "Disable"}
            </Badge>
          )
        },
        {
          name: "Actions",
          minWidth: "50",
          sortable: false,
          cell: row => (
            <ActionsComponent
              row={row}
              getData={this.props.getData}
              parsedFilter={this.props.parsedFilter}
              rowEdit = {this.rowEdit}
              rowDelete={this.props.menudelete}
            />
          )
        },
      ],
      allData: [],
      value: "",
      rowsPerPage: 10,
      sidebar: false,
      currentData: null,
      selected: [],
      totalRecords: 0,
      sortIndex: [],
      modal: false,
      image : "",
      name  :"",
      gainPrice : "",
      bidPrice : "",
      priceWin : "",
      update : false,
      rowid : "",
      isChecked : false,
      tooltipOpen : false,
      imgmodal : false,
      imageSrc : "",
      file : null,
      bool : "",
      bazaartype : []
    }

    componentDidMount(){
      this.props.getData(this.props.parsedFilter)
    }

    handleFilter = e => {
      this.setState({ value: e.target.value });
      this.props.filterData(e.target.value)
    }

    handleRowsPerPage = value => {
      let { parsedFilter, pagenationchange } = this.props
      let page = parsedFilter.page !== undefined ? parsedFilter.page : 1
      history.push(`${history.location.pathname}?page=${page}&perPage=${value}`)
      this.setState({ rowsPerPage: value });
      pagenationchange({ page: page, perPage: value })
    }

    handlePagination = page => {
      let { parsedFilter, pagenationchange } = this.props
      let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 10
      let urlPrefix = history.location.pathname;
      history.push( `${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}` )
      pagenationchange({ page: page.selected + 1, perPage: perPage })
      this.setState({ currentPage: page.selected })
    }

    toggleModal = () => {
      this.setState(prevState => ({
        modal: !prevState.modal,
        update : false,
        name : "",
        image : "",
        bidPrice : "",
        isChecked : false,
        gainPrice : "",
        priceWin : "",
        bool : ""
     
      }))
    }

    handleSubmit = (e)=>{
      e.preventDefault();

      let array = this.state.bazaartype;
      let types = {}
      for (let i in array) {
        types[array[i].value] = true;
      }
      this.setState(prevState => ({
        modal: !prevState.modal
      }));

      if (!this.state.update) {
        var row = {
          name : this.state.name,
          bool : this.state.bool,
          status : this.state.isChecked,
          bazaartype : types,
        }
        this.props.menusave(row,this.props.parsedFilter);
      } else {
        var row2 = {
          name : this.state.name,
          _id  :this.state.rowid,
          status : this.state.isChecked,
          bool : this.state.bool,
          bazaartype : types,
        }
        this.props.menuupdate(row2,this.props.parsedFilter);
      }
    }

    rowEdit = (row) =>{
      let array = [];
      for (let i in row.bazaartype) {
        array.push({label : BazaarStringType[i],value : i});
      }

      this.setState({ name : row.name,
        modal : true,
        image : row.image,
        rowid : row._id,
        update : true,
        ordernum : row.order,
        isChecked : row.status,
        bazaartype  :array,
        bool : row.bool});
    }

    handleSwitchChange = () => {
      this.setState({
        isChecked: !this.state.isChecked
      })
    }

    toggleTooltip = () => {
      this.setState({
        tooltipOpen: !this.state.tooltipOpen
      })
    }

    ImgtoggleModal = () =>{
      this.setState({imgmodal : !this.state.imgmodal })
    }

    ImgEdit = (item) =>{
      this.setState({imgmodal : !this.state.imgmodal ,imageSrc :  Root.imageurl+item.image,rowid : item._id})
    }

    fileupload = (file) =>{
      this.setState({imgmodal : !this.state.imgmodal})
      const fpdata = new FormData();
      fpdata.append('fpImgFile', file);
      fpdata.append('_id', this.state.rowid);
      this.props.filesupload(fpdata,this.props.parsedFilter)
    }

    render() {
      let { columns, data, allData,totalPages, value, rowsPerPage, totalRecords, sortIndex } = this.state
      return (
        <div  id="admindata_table"  className={`data-list list-view`}>
          <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="modal-dialog-centered" >
            <Form onSubmit={this.handleSubmit}  action={history.location.pathname} >
              <ModalHeader toggle={this.toggleModal} className="bg-primary">
                Item Edit
              </ModalHeader>
              <ModalBody className="modal-dialog-centered  mt-1">
                <Row>
                  <Col md="12">
                    <FormGroup className="form-label-group position-relative has-icon-left">
                      <Input type="text" placeholder="name" value={this.state.name}
                        onChange={e => this.setState({ name: e.target.value })} required />
                        <div className="form-control-position" >
                          <Edit2 size={15} />
                        </div>
                        <Label>name</Label>
                    </FormGroup>
                  </Col>

                  <Col md="12">
                    <FormGroup>
                        <Label for="gender">bazaartype</Label>
                        <Select
                          isClearable={false} isMulti closeMenuOnSelect={false} 
                          components={animatedComponents} 
                          className="react-select" classNamePrefix="select" id="bazaartype" name="bazaartype"
                          options={bazaartype} value={this.state.bazaartype}
                          onChange={e => this.setState({bazaartype : e})} 
                        />
                    </FormGroup>
                  </Col>
                
                  <Col md="12">
                    <FormGroup className="form-label-group position-relative has-icon-left">
                      <Input type="text" placeholder="bool" value={this.state.bool}
                        onChange={e => this.setState({ bool: e.target.value })} required />
                      <div className="form-control-position" >
                        <Award size={15} />
                      </div>
                      <Label>bool</Label>
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <label className="react-toggle-wrapper">
                    <Toggle checked={this.state.isChecked} onChange={this.handleSwitchChange} 
                      name="controlledSwitch" value="yes" />
                    <Button.Ripple color="primary" onClick={this.handleSwitchChange}size="sm" >
                      {this.state.isChecked ? "Enable" : "Diable"}
                    </Button.Ripple>
                  </label>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                {
                  this.state.update ? <Button color="primary" type="submit">update</Button> : <Button color="primary" type="submit">Accept</Button>
                }
              </ModalFooter>
            </Form>
          </Modal>

          
          <Demo modal={this.state.imgmodal} Logoload = {this.fileupload} aspect={1/1}  props = {this.props}  cropSize={{width:500,height:500}}modalflg={this.ImgtoggleModal}  filedupload ={this.fileupload} />
        
          <DataTable
            columns={columns}
            data={value.length ? allData : data}
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
            // selectableRows
            pointerOnHover
            selectableRowsHighlight
            onSelectedRowsChange={data => this.setState({ selected: data.selectedRows })}
            customStyles={selectedStyle}
            subHeaderComponent={
              <CustomHeader
                handleFilter={this.handleFilter}
                handleRowsPerPage={this.handleRowsPerPage}
                rowsPerPage={rowsPerPage}
                total={totalRecords}
                index={sortIndex}
                parsedFilter={this.props.parsedFilter}
                handleSidebar={this.toggleModal}
              />
            }
            sortIcon={<ChevronDown />}
          />
        </div>
      )
    }
  }

  const mapStateToProps = state => {
    return {
      dataList: state.matka.gameslist
    }
  }

export default connect(mapStateToProps, {getData,filterData,menusave,menuupdate,menudelete,pagenationchange,filesupload})(Child)