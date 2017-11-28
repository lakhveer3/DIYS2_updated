import React, {Component} from 'react';
import ReactDOM from "react-dom";
import request from 'superagent';
import { Grid, Dropdown ,Label, Form, Input ,Button} from "semantic-ui-react";
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

class DeleteStores extends React.Component {
  constructor (props) {
      super(props);
      this.state = {
        country: '',
         region: '' ,
         store: [],
         selectedStore:'',
       };

    }

    selectCountry (val) {
      this.setState({ country: val },function(){
      //  console.log(this.state.country,"country");
      });
    }

    selectRegion (val) {
      this.setState({ region: val },function()
      {
      var arr1=[];
        console.log(this.state.region,"region");
        console.log(this.state.country,"country");
        var that =this;
        request.post('/getStore')
        .query({country:that.state.country,region:that.state.region})
        .end(function(err, res){
          if (err || !res.ok) {
            alert('Oh no! error');
          } else {
            if(res.body.details.store!=0){
                console.log(res.body.details.store,"_________");
                    res.body.details.store.map((item)=>{
                       arr1.push({text: item ,value: item});
                    });
                   that.setState({store:arr1});
          }
   }

 });
});
}
    //       $.ajax({
    //         type:'POST',
    //         url: '/getStore',
    //         data:{
    //           'country':that.state.country,
    //           'region':that.state.region
    //
    //         },
    //       success: function(data) {
    //         if(data.store.length!=0){
    //         data.store.map((item)=>{
    //           arr1.push({text: item ,value: item});
    //         });
    //        that.setState({store:arr1});
    //      }
    //       },
    //       error: function(err) {
    //         console.log("Error");
    //       }
    //     })
    // });


    selectStore (evt,result) {
      this.setState({selectedStore:result.value});
    }

    deleteStore(){
      var context = this;
      request.post('/deleteStore')
      .query({country:context.state.country,
              region:context.state.region,
              store: context.state.selectedStore})
      .end(function(err, res){
             if (err || !res.ok) {
               alert('Oh no! error');
             } else {
               alert('Store got deleted ');
                location.reload();
             }
           });
      // $.ajax({
      //   type:'POST',
      //   url:'/deletestores',
      //   data:{
      //     country:context.state.country,
      //     region:context.state.region,
      //     store: context.state.selectedStore
      //   },
      //   success:function(data){
      //       alert("success");
      //       location.reload();
      //   },
      //   error:function(err){
      //     alert("error");
      //   }
      // })
    }


    render () {
      const { country, region } = this.state;
      return (
        <div>
        <Form>
          <Grid.Row style={{ margin: "6%" }}>
            <Grid.Column>
              <CountryDropdown
              defaultOptionLabel='Select your country'
              value={this.state.country}
              onChange={(val) => this.selectCountry(val)}
            />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ margin: "6%" }}>
            <Grid.Column>
              <RegionDropdown
              blankOptionLabel='No country selected'
              defaultOptionLabel='Now select your state'
              country={country}
              placeholder='select state'
              value={this.state.region}
              onChange={(val) => this.selectRegion(val)}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ margin: "6%" }}>
            <Grid.Column>
              <Dropdown
                button
                className="icon "
                floating
                labeled
                icon="shopping basket"
                options={this.state.store}
                search
                placeholder="Select a Store"
                onChange={this.selectStore.bind(this)}
                style={{ border: "1px solid black", width: "75%",textAlign:'center'}}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ margin: "6%" }}>
            <Grid.Column>
              <Button negative style={{ marginLeft: "40%" }} onClick={this.deleteStore.bind(this)}>Delete </Button>
            </Grid.Column>
          </Grid.Row>
          </Form>
        </div>
      );
    }
}
export default DeleteStores;
