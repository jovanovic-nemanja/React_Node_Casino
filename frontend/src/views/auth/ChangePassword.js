import React from "react"
import { Col, Input, Button,Card,CardBody,FormGroup,Form} from "reactstrap"
import { connect } from "react-redux"
import {changepassword} from "../../redux/actions/auth/loginActions"
import {Lock,Settings} from "react-feather"
import {history} from "../../history"

class ChangePassword extends React.Component{

    state = {
        current_pass: "",
        new_pass: "",
        confirm_pass: "",
        cisValid: null,
        nisValid: null,
        fisValid: null
    }

    save_password = (e) => {
        e.preventDefault()
        if (this.state.current_pass.length > 0) {
            this.setState({ cisValid: true });
        } else if (this.state.current_pass.length === 0) {
            this.setState({ cisValid: false });
            return;
        }

        if (this.state.new_pass.length > 0) {
            this.setState({ nisValid: true })
        } else if (this.state.new_pass.length === 0) {
            this.setState({ nisValid: false })
            return;
        }
        if (this.state.confirm_pass.length > 0) {
            this.setState({ fisValid: true })
        } else if (this.state.confirm_pass.length === 0) {
            this.setState({ fisValid: false })
            return;
        }

        if(this.state.confirm_pass !== this.state.new_pass){
            alert("Please input correct password and confirmpassword");
            return;
        }
        this.props.changepassword({password : this.state.confirm_pass,currentpassword: this.state.current_pass});
        this.setState({
            currentpassword : '',
            password : '',
            confirmpassword : '',
        })
    }

    reset(){
        this.setState({new_pass:"",current_pass : "",confirm_pass : ""});
    }

    render(){
        return (
            <React.Fragment>
                <Form action={history.location.pathname}onSubmit={this.save_password} >
                <Card>
                    <CardBody className="pt-1" style={{color:"white"}}>
                        <Col lg="12" md="12" xs="12" style={{padding:"4vw"}}>
                            <h2  style={{color:"#00cfe8",textAlign:"center",marginBottom:"3vw"}}>
                             admin ChangePassword
                            </h2>
                            <FormGroup className="has-icon-left form-label-group position-relative">
                                <Input
                                    type="password"
                                    placeholder="CurrentPassword"
                                    required
                                    valid={this.state.cisValid === true}
                                invalid={this.state.cisValid === false}
                                    value={this.state.current_pass}
                                    onChange={e => this.setState({ current_pass: e.target.value })}
                                />
                                    <div className="form-control-position">
                                        <Lock size={15} />
                                    </div>
                            </FormGroup>
                            <FormGroup className="has-icon-left form-label-group position-relative">
                                <Input
                                    type="password"
                                    placeholder="newPassword"
                                    valid={this.state.nisValid === true}
                                invalid={this.state.nisValid === false}
                                    required
                                    value={this.state.new_pass}
                                    onChange={e => this.setState({ new_pass: e.target.value })}
                                />
                                    <div className="form-control-position">
                                        <Settings size={15} />
                                    </div>
                            </FormGroup>
                            <FormGroup className="has-icon-left form-label-group position-relative">
                                <Input
                                    type="password"
                                    placeholder="confirmPassword"
                                    required
                                    valid={this.state.fisValid === true}
                                invalid={this.state.fisValid === false}
                                    value={this.state.confirm_pass}
                                    onChange={e => this.setState({ confirm_pass: e.target.value })}
                                />
                                    <div className="form-control-position">
                                        <Settings size={15} />
                                    </div>
                            </FormGroup>
                            
                            <Button.Ripple color="success" type="submit" className="mr-1"  onClick={this.save_password} >Save
                            </Button.Ripple>

                            <Button.Ripple color="danger"  onClick={this.reset} >Reset
                            </Button.Ripple>

                        </Col>
                    </CardBody>
                </Card>
                </Form>
               
            </React.Fragment>
        )
    }
}

const getusers = (state) =>{
    return {
        users: state.auth.login
    }
}

export default connect(getusers,{changepassword})(ChangePassword)