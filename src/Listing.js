import React from 'react'; 

class Listing extends React.Component {
    constructor(props) {
        super(props);
        this.getPullRequest();
        this.state  = {
            items: [],
            list: [],
            flag: true,
            messages: []
        }
    }
    getPullRequest() {
        fetch('https://api.github.com/repos/facebook/react/pulls?access_token=0acea5e6bfa8950f76a75f19250454236487ad76&state=all&page=1&per_page=100')
        .then((res) => {
            console.log(res.headers, 'HEADERS');
            res.json().then((result) => {
                this.setState({
                    items: result
                })
                console.log(this.state.items, 'iTEMS');
                var list =[]
                Object.keys(this.state.items).map((title) => { //eslint-disable-line
                    let pullRequest = this.state.items[title].title;
                    let stateRequest = this.state.items[title].state;
                    let numberRequest = this.state.items[title].number;
                    let nameRequest = this.state.items[title].user.login;
                    fetch(`${this.state.items[title].comments_url}?access_token=0acea5e6bfa8950f76a75f19250454236487ad76`).then((response) => {
                        let obj = {
                            name: '',
                            title: '',
                            stateRequest: '',
                            numberRequest: '',
                            com: []
                        };
                        response.json().then((result) => {
                            console.log(result, 'result');
                            list.push( 
                                obj = {
                                        name: nameRequest,
                                        title: pullRequest,
                                        stateRequest: stateRequest,
                                        numberRequest: numberRequest,
                                        com: result
                                    }
                            )
                            console.log('samaan -->>>', this.state);
                        })
                        this.setState({ list :list })
                    })
                });
            });
       });
    }
    handleClick(response) {
        console.log(response, 'inside click')
        this.setState({
            flag: !this.state.flag
        });
        let messages = []; 
        response.com.map((res) => {
            console.log(res, '<<--resp');
            messages.push(res);
        })
        console.log(messages, '<<<<<<<<<<array');
        this.setState({
            messages: messages
        })
        console.log(this.state.messages, 'state message');
    }
    render() {
        this.state.list.sort((a,b) => {
            return b.com.length - a.com.length
        });
        console.log(this.state.list, 'LIST');
        return (
            this.state.flag ?
            <div className="container" >
                {/* <div>
                    {
                        this.state.list.map((resp, index) => {
                            return(
                            <ul onClick={() => {this.handleClick(resp)}}>
                                <li key={index}>
                                    <div>
                                        <div>{resp.title}</div>
                                        <div>{resp.stateRequest}</div>
                                        <div>{resp.numberRequest}</div>
                                        <div>{resp.com.lenght}</div>
                                    </div>
                                </li>
                            </ul>
                            );
                        })
                    }
                </div> */}
                <table className="table table-condensed">
                    <thead>
                        <tr>
                            <th>Pull Requests</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.list.map((resp, index) => {
                                return(
                                    <tr align="left" key={index} style={{cursor: 'pointer'}} onClick={() => {this.handleClick(resp)}}>
                                        <td>
                                            <table>
                                                    <tr><td>Created By: {resp.name}</td></tr>
                                                    <tr><td>{resp.title}</td></tr>
                                                    <tr><td>{resp.stateRequest}</td></tr>
                                                    <tr><td>#{resp.numberRequest}</td></tr>
                                            </table>
                                        </td>
                                        <td>{resp.com.length}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>  
                :
            <div>                    
                <table>
                    <thead>
                        <tr>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.messages.map((res) => {
                        return(
                        <tr align="left">
                            <td>
                                <li dangerouslySetInnerHTML={{__html: res.body}} ></li>
                            </td>
                        </tr>
                        );
                        })
                    }
                    </tbody>
                </table>
                <button onClick={
                    () => {
                        this.setState({
                            flag: !this.state.flag
                        })
                    }
                }>Back</button>
            </div>
        );
    }
}

export default Listing;
