import React, { Component } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { savePokerGridAPI, loadPokerAPI, updatePokerGridAPI } from '../../redux/actions/auth/loginActions'
import { connect } from 'react-redux';

class PokerGridAPI extends Component {
    constructor() {
        super();
        this.state = {
            authenticateURL: '',
            creditURL: '',
            debitURL: '',
            homeURL: '',
            updateSessionURL: '',
            isData: false,
            editable: false
        }
    }

    componentDidMount = () => {
        this.props.loadPokerAPI({id: this.props.userdetail.operatorID})
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.poker_api_data && this.props !== prevProps) {
            this.setState({
                authenticateURL: this.props.poker_api_data.authenticateURL,
                creditURL: this.props.poker_api_data.creditURL,
                debitURL: this.props.poker_api_data.debitURL,
                homeURL: this.props.poker_api_data.homeURL,
                updateSessionURL: this.props.poker_api_data.updateSessionURL,
                isData: true,
                editable: true
            })
        }
    }

    handleSubmit = () => {
        var row = {...this.state};
        
        delete row.editable;
        delete row.isData;
        
        var data = {
            id : this.props.userdetail.operatorID,
            ...row
        }
        
        this.state.isData ? this.props.updatePokerGridAPI(data) : this.props.savePokerGridAPI(data);
        this.setState({ editable: true })
    }
    render() {
        return (
            <Row>
                <Form className="w-100">
                    <Col md='12'>
                        <FormGroup>
                            <Label for="basicInput">Authenticate</Label>
                            <Input
                                type="text" 
                                placeholder="Enter Authenticate URL" 
                                value={this.state.authenticateURL} 
                                onChange={e => this.setState({authenticateURL: e.target.value})} 
                                required 
                                disabled={this.state.editable ? true : false}
                            />
                        </FormGroup>
                    </Col>
                    <Col md='12'>
                        <FormGroup>
                            <Label for="basicInput">Credit</Label>
                            <Input 
                                type="text" 
                                placeholder="Enter Credit URL" 
                                value={this.state.creditURL} 
                                onChange={e => this.setState({creditURL: e.target.value})} 
                                required 
                                disabled={this.state.editable ? true : false}
                            />
                        </FormGroup>
                    </Col>
                    <Col md='12'>
                        <FormGroup>
                            <Label for="basicInput">Debit</Label>
                            <Input 
                                type="text" 
                                placeholder="Enter Debit URL" 
                                value={this.state.debitURL} 
                                onChange={e => this.setState({debitURL: e.target.value})} 
                                required 
                                disabled={this.state.editable ? true : false}
                            />
                        </FormGroup>
                    </Col>
                    <Col md='12'>
                        <FormGroup>
                            <Label for="basicInput">HomeUrl</Label>
                            <Input 
                                type="text" 
                                placeholder="Enter Region" 
                                value={this.state.homeURL} 
                                onChange={e => this.setState({homeURL: e.target.value})} 
                                required 
                                disabled={this.state.editable ? true : false}
                            />
                        </FormGroup>
                    </Col>
                    <Col md='12'>
                        <FormGroup>
                            <Label for="basicInput">UpdateSession</Label>
                            <Input 
                                type="text" 
                                placeholder="Enter Region" 
                                value={this.state.updateSessionURL} 
                                onChange={e => this.setState({updateSessionURL: e.target.value})} 
                                required 
                                disabled={this.state.editable ? true : false}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="12">
                        {
                            this.state.editable ? 
                                <Button className="float-right" color="primary" type="button" onClick={() => this.setState({editable: false})}>Edit</Button>
                            :
                                <Button className="float-right" color="primary" type="button" onClick={() => this.handleSubmit()}>Save</Button>
                        }
                    </Col>
                </Form>
            </Row>
        );
    }
}

const mapStateToProps = state => {
    return {
        userdetail: state.auth.login.userdetail,
        permission : state.userslist.permission.permissiondata,
        poker_api_data: state.auth.login.poker_api_data
    }
}

export default connect(mapStateToProps, {savePokerGridAPI, loadPokerAPI, updatePokerGridAPI})(PokerGridAPI);