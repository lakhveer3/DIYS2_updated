import React, {Component} from 'react';
import ReactDOM from "react-dom";
import request from 'superagent';
import {Modal, Grid, Dropdown ,Label, Form, Input ,Button} from "semantic-ui-react";
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';


class AddStores extends React.Component {
  constructor (props) {
      super(props);
      this.state = { country: '', region: '' ,store: [],open:false,result:''};

    }
    alertbox(res){
      this.setState({open:true,result:res});
    }
    selectCountry (val) {
      this.setState({ country: val },function(){
        console.log(this.state.country,"country");
      });
    }

    selectRegion (val) {
      this.setState({ region: val },function()
    {
      console.log(this.state.region,"region");
    });
    }

    storeDetails(event){
      let storeValue = event.target.value;
      this.setState({store:storeValue},function()
      {
        console.log(this.state.store,"store");
      });
    }
    close (){
      this.setState({ open: false });
    }
    handleSubmit(){
          let context = this;
          request.post('/addStore')
          .query({country:context.state.country,
              region:context.state.region,
              store:context.state.store})
          .end((err, res)=>{
            if (err) {
              this.alertbox('There is some error');
            } else {
              //alert('Store successfully added ');
              console.log(res,"for alert------");
              this.alertbox(res.text);
            }
          });

        }

    render () {
      const { country, region } = this.state;
      const { open} = this.state;
      const response = this.state.result;
      return (
        <div>

           <Grid columns={2} divided>
            <Grid.Row>
              <Grid.Column >
                <Label>Select the country</Label>
              </Grid.Column>
              <Grid.Column >
                <CountryDropdown
                defaultOptionLabel='Select your country'
                value={this.state.country}
                onChange={(val) => this.selectCountry(val)} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column >
                <Label>Select the state</Label>
              </Grid.Column>
              <Grid.Column>
                <RegionDropdown
                blankOptionLabel='No country selected'
                defaultOptionLabel='Now select your state'
                country={country}
                placeholder='select state'
                value={this.state.region}
                onChange={(val) => this.selectRegion(val)} />
             </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column >
                <Label>Enter the store</Label>
              </Grid.Column>
              <Grid.Column >
                <Input placeholder='Store' onChange={this.storeDetails.bind(this)}/>
             </Grid.Column>
            </Grid.Row>
            <Grid.Row>
               <Button positive onClick={this.handleSubmit.bind(this)}>Submit</Button>
            </Grid.Row>
          </Grid>
          <Modal style={{width:'40%'}} open={open}>

                    <Modal.Content>
                      <h4>{response}</h4>
                    </Modal.Content>
                    <Modal.Actions>
                      <Button positive onClick={this.close.bind(this)}>
                        Ok
                      </Button>
                    </Modal.Actions>
                  </Modal>
        </div>
      );
    }
  }
export default AddStores;
