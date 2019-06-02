import React, {Component} from 'react';



class Signup extends Component {
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:''
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
        this.props.onSignup(this.state.username, this.state.password);
    }


    render() {
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
                               value={"Signup"}>
                        </input>
                    </form>


                </div>
            </div>


        );
    }
}

export default Signup;