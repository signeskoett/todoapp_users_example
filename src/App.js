import React, {Component} from 'react';
import './App.css';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import List from './List'
import AddTask from "./AddTask";
import Login from "./Login";
import AuthService from './AuthService';

class App extends Component {

    API_URL = 'http://localhost:8080/api';

    constructor(props) {
        super(props);

        this.Auth = new AuthService(`${this.API_URL}/users`);

        this.state = {
            todoList: [],
            // TODO: This needs to come from a Login component.
            username: "",
            password: "",
            token:''
        };

        this.addTask = this.addTask.bind(this);
        this.setDone = this.setDone.bind(this);
        this.login = this.login.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.onSignup = this.onSignup.bind(this);
    }


    componentDidMount() {
        this.setState({
            token: localStorage.getItem("token")
        })
        console.log("App component has mounted");

    }

    getData() {
        this.Auth.fetch(`${this.API_URL}/tasks`)
            .then(result => {
                console.log(result)
                this.setState({
                    todoList: result.tasks
                });
            })
            .catch(error => {
                // TODO: Inform the user about the error
                console.error("Error when fetching: ", error);
            })
    }

    addTask(task) {
        let newTask = {
            task: task,
            done: false
        };

        this.Auth.fetch(`${this.API_URL}/tasks`, {
            method: "POST",
            body: JSON.stringify(newTask)
        })
            .then(result => {
                this.getData();
            })
            .catch(error => {
                // TODO: Inform the user about the error
                console.error("Error when adding task: ", error);
            })
    }

    setDone(id, done) {
        let task = this.state.todoList.find(elm => elm.id === id);
        task.done = done;

        this.Auth.fetch(`${this.API_URL}/tasks/${id}`,{
            method: "PUT",
            body: JSON.stringify(task)
        })
            .then(result => {
                this.getData();
            })
            .catch(error => {
                // TODO: Inform the user about the error
                console.error("Error when setting done: ", error);
            })
    }

    //Login funktion
    async login(username, password) {
        let result = await this.Auth.login(username, password);

        this.setState({
        token: result.token
        })
    }

    onLogout(){
        let result = this.Auth.logout()

        this.setState({
            token: undefined
        })

    }

    //SignUp funktion
   async onSignup(username, password){
        await this.Auth.signup(username, password);
       this.login(username, password);


    }



    render() {
    console.log(this.state.token)


        // TODO: This app should render a Login component when the user
        // TODO: is not logged in.
        // TODO: Otherwise is should render the list as usual.

        // TODO: Create a Login component
        let token = this.state.token
        if(token == 'undefined' || !token){
            console.log(token)
            return <Login login={this.login} onSignup={this.onSignup}> </Login>
        }

        return (

            <Router>
                <div className="container">

                    <div className="row">
                        <div className="col-sm"/>
                        <div className="col-sm-8">
                            <h4 className="display-4">ToDo List</h4>
                            <br/>
                            <List todoList={this.state.todoList} setDone={this.setDone}/>
                            <br/>
                            <AddTask addTask={this.addTask}/>
                        </div>
                        <div className="col-sm"/>
                        <button onClick={this.onLogout} >Log ud</button>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
