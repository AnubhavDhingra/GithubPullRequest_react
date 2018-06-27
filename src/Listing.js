import React from 'react'; 

class Listing extends React.Component {
    constructor(props) {
        super(props);
        this.state  = {
            items: [],
            list: [],
            flag: true,
            messages: []
        }
    }
    componentWillMount() {
        fetch('https://api.github.com/repos/facebook/react/pulls?access_token=0acea5e6bfa8950f76a75f19250454236487ad76&state=all')
        .then((res) => {
            res.json().then((result) => {
                this.setState({
                    items: result
                })
                console.log(this.state.items, 'iTEMS');
                var list =[]
                Object.keys(this.state.items).map((title) => { //eslint-disable-line
                    let pullRequest = this.state.items[title].title;
                    fetch(`${this.state.items[title].comments_url}?access_token=0acea5e6bfa8950f76a75f19250454236487ad76`).then((response) => {
                        let obj = {
                            pulls: '',
                            com: []
                        };
                        response.json().then((result) => {
                            console.log(result, 'result');
                            list.push( 
                                obj = {
                                        pulls: pullRequest,
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
        console.log(this.state.list, 'LIST');
        return (
            this.state.flag ?
            <div className="container" >
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
                                    <tr key={index} onClick={() => {this.handleClick(resp)}}>
                                        <td>{resp.pulls}</td>
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
                        <td>
                            {res.body}
                        </td>
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
