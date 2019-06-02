import React, {Component} from 'react';
import Signup from "./Signup";



class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:'',
            showSignup: false
        }
        this.onChange = this.onChange.bind(this);
        this.handleInput = this.handleInput.bind(this);

    }

    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleInput(event) {
        event.preventDefault();
        this.props.login(this.state.username, this.state.password);
    }


    render() {

        if(this.state.showSignup === true){
            return <Signup onSignup={this.props.onSignup} />
        }
        return (
            <div>

                <div>
                    <form>
                        <input
                            hint="Enter your Username"
                            name={"username"}
                            onChange = {this.onChange}
                        />
                        <br/>
                        <input
                            type="password"
                            hint="Enter your Password"
                            name={"password"}
                            onChange = {this.onChange}
                        />
                        <br/>

                        <input type={"submit"} /*onClick={this.handleInput}*/
                            type="submit"  onClick={(event) => this.handleInput(event)}
                        value={"Login"}>
                        </input>
                    </form>
                    <button onClick={() => this.setState({showSignup: true})}>Signup</button>

                </div>
            </div>


        );
    }
}

export default Login;