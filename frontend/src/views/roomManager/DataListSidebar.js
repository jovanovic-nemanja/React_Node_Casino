import React, { Component } from "react"
import { Label, Input, FormGroup ,Form, Button, Modal,ModalHeader,ModalBody,ModalFooter,Col,Row} from "reactstrap";
import {connect} from "react-redux"
import { createPokerRoom, updatePokerRoom } from '../../redux/actions/pokerRoom';
import {get_userinfor} from "../../redux/actions/auth/loginActions"
import { roomType } from '../../configs/providerconfig';
import Select from "react-select";
import { toast } from "react-toastify";

class DataListSidebar extends Component {

  state = {
    _id: "",
    roomName : "",
    roomType : roomType[0],
    operator : "",
    minplayers : 2,
    maxplayers : 9,
    minbuyin : 1000,
    maxbuyin : 2000,
    smallblind : 1,
    bigblind : 2,
    timeout : 15000
  }
  componentDidMount(){
    this.props.get_userinfor();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      var data = this.props.data;
      this.setState({
        _id: data._id,
        roomName : data.roomName,
        roomType : roomType.filter(e => {return e.value === data.roomType})[0],
        minplayers : data.minplayers,
        maxplayers : data.maxplayers,
        minbuyin : data.minbuyin,
        maxbuyin : data.maxbuyin,
        smallblind : data.smallblind,
        bigblind : data.bigblind,
        timeout : 15000
      });
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        roomName : "",
        roomType : roomType[0],
        operator : "",
        minplayers : 2,
        maxplayers : 9,
        minbuyin : 1000,
        maxbuyin : 2000,
        smallblind : 1,
        bigblind : 2,
        timeout : 15000
      })
    }
  }

  handleSubmit = e =>{
    e.preventDefault();

    if (this.state.minplayers < 2) {
      toast.warn("Min players should be over 2!");
      return;
    } else if (this.state.maxplayers > 9) {
      toast.warn("Max players should be less than 9!");
      return;
    } else if (this.state.minplayers > this.state.maxplayers) {
      toast.warn("Min players should be less than Max players!");
      return;
    }

    var row = {...this.state}
    row.operator = this.props.userdetail.operatorID
    row.roomType = this.state.roomType.value;

    if (this.props.data !== null) {
      this.props.updatePokerRoom(row, this.props.dataParams,this.props.me.value)
    } else {
      delete row._id;
      this.props.createPokerRoom(row, this.props.dataParams,this.props.me.value);
    }
    this.toggleModal();
  }

  toggleModal = () => {
    this.props.handleSidebar(false, true)
  }

  render() {
    let { data, handleSidebar } = this.props;
    return (
      <Modal isOpen={this.props.show} toggle={this.toggleModal} className="modal-dialog-centered modal-lg">
        <Form className="" action="#" onSubmit={this.handleSubmit}>
          <ModalHeader toggle={this.toggleModal} className="bg-primary">
            {data !== null ? "UPDATE POKER ROOM" : "ADD POKER ROOM"}
          </ModalHeader>
          <ModalBody className="mt-1">
            <Row>
              <Col md="4" sm="12">
                <FormGroup>
                  <Label for="roomname">Room Name *</Label>
                  <Input type="text" name="roomname" id="roomname" placeholder="Room Name"
                      onChange={e=>this.setState({roomName : e.target.value})}
                      value = {this.state.roomName}
                      required
                  />
                </FormGroup>
              </Col>
              <Col md="4" sm="12">
                <FormGroup>
                  <Label for="roomType">Room Type *</Label>
                  <Select
                    className="React"
                    classNamePrefix="select"
                    id="roomType"
                    name="roomType"
                    options={roomType}
                    value={this.state.roomType}
                    onChange={roomType => this.setState({ roomType })}
                  />
                </FormGroup>
              </Col>
              <Col md="4" sm="12">
                <FormGroup>
                  <Label for="minplayer">Min Player *</Label>
                  <Input type="number" name="minplayer" id="minplayer" placeholder="Min Player"
                      onChange={e=>this.setState({minplayers : e.target.value})}
                      value = {this.state.minplayers}
                      required
                  />
                </FormGroup>
              </Col>
              <Col md="4" sm="12">
                <FormGroup>
                  <Label for="maxplayer">Max Player *</Label>
                  <Input type="number" name="maxplayer" id="maxplayer" placeholder="Max Player"
                      onChange={e=>this.setState({maxplayers : e.target.value})}
                      value = {this.state.maxplayers}
                      required
                  />
                </FormGroup>
              </Col>
              <Col md="4" sm="12">
                <FormGroup>
                  <Label for="minbuyin">Min Buyin *</Label>
                  <Input type="number" name="minbuyin" id="minbuyin" placeholder="Min Buyin"
                      onChange={e=>this.setState({minbuyin : e.target.value})}
                      value = {this.state.minbuyin}
                      required
                  />
                </FormGroup>
              </Col>
              <Col md="4" sm="12">
                <FormGroup>
                  <Label for="maxbuyin">Max Buyin *</Label>
                  <Input type="number" name="maxbuyin" id="maxbuyin" placeholder="Max Buyin"
                      onChange={e=>this.setState({maxbuyin : e.target.value})}
                      value = {this.state.maxbuyin}
                      required
                  />
                </FormGroup>
              </Col>
              <Col md="4" sm="12">
                <FormGroup>
                  <Label for="smallblind">Small Blind *</Label>
                  <Input type="number" name="smallblind" id="smallblind" placeholder="Small Blind"
                      onChange={e=>this.setState({smallblind : e.target.value})}
                      value = {this.state.smallblind}
                      required
                  />
                </FormGroup>
              </Col>
              <Col md="4" sm="12">
                <FormGroup>
                  <Label for="bigblind">Big Blind *</Label>
                  <Input type="number" name="bigblind" id="bigblind" placeholder="Big Blind"
                      onChange={e=>this.setState({bigblind : e.target.value})}
                      value = {this.state.bigblind}
                      required
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Row>
              <Col xs="12 justify-content-start">
                <Button color="primary" type="submit">{data !== null ? "Update" : "Submit"} </Button>
                <Button className="ml-1" color="danger" outline onClick={() => handleSidebar(false, true)}> Cancel </Button>
              </Col>
            </Row>
          </ModalFooter>
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  return {
    permission : state.userslist.permission.permissiondata,
    userdetail : state.auth.login.userdetail
  }
}

export default connect(mapStateToProps,{get_userinfor, createPokerRoom, updatePokerRoom})(DataListSidebar)