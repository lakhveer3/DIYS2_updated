import React, {Component} from 'react';
import ReactDOM from "react-dom";
import { Segment , Tab,Button} from 'semantic-ui-react'
import AddStores from './addStore.jsx';
import DeleteStores from './deleteStore.jsx';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import request from 'superagent';
import {hashHistory} from 'react-router';
const panes = [
  { menuItem: 'Add Store', render: () => <Tab.Pane attached={false}><AddStores /></Tab.Pane> },
  { menuItem: 'Delete Store', render: () => <Tab.Pane attached={false}><DeleteStores /></Tab.Pane> },
]


class Retailer extends React.Component {
  constructor () {
      super();
      this.handlelogout =this.handlelogout.bind(this);
    }
    handlelogout(){
      console.log(cookies.get('email'),"cookie before logout");
      cookies.remove('email');
       request.post('/logout')
       .query({email: cookies.get('email')})
       .end((err, res) => {
         if (err)
           console.log(err);
           else
           console.log(res,'response')
  	        alert('Logged out successfully');
        hashHistory.push('/');
  	  location.reload();
       });
    }
    render(){
      var abc;
  	  if(cookies.get('email')){
      abc=(<div><Segment className="retailer">
      <Button color='red' type='submit'style={{float:'right',marginRight:'5%',marginTop:'0%'}} onClick={this.handlelogout}>Logout</Button>
          <h1>  You can <b>Add </b> or <b>Delete</b> the store here.</h1>

        <Tab style={{color:'#fbe5d6'}} menu={{ secondary: true, pointing: true }} panes={panes} />

      </Segment></div>);
      }
      else{
  		  console.log("in else ");
  	  hashHistory.push('/');
  	   location.reload();
  	  }
        return(
  		abc
  	  )
      }

  }
  export default Retailer;
