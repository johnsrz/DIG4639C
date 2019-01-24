import React from 'react';

class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.state = {error: ''};
  
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
  
      isAlpha(str) {
        var code, i, len;
      
        for (i = 0, len = str.length; i < len; i++) {
          code = str.charCodeAt(i);
          if (!(code > 64 && code <  91) && // upper alpha (A-Z)
              !(code > 96 && code < 123) && // lower alpha (a-z)
              !(code == 32)) { // Space
            return false;
          }
        }
        return true;
      };

    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
     handleSubmit(event) {
      if (this.isAlpha(this.state.value) && this.state.value.length > 1) {
        alert('A name was submitted: ' + this.state.value);
        this.setState({error: 'false'});
      } else {
        alert('An Invalid name containing non alphabetic characters was submitted: ' + this.state.value);
        this.setState({error: 'true'});
      }

      event.preventDefault();
    }
  
    render() {
            
        if (this.state.error == 'false'){
          return (
            <p>"{this.state.value}" was submitted.</p>
          );
        } else {
          return (
            <form onSubmit={this.handleSubmit}>
              <label>
                Name:
                <input type="text" value={this.state.value} onChange={this.handleChange} />
              </label>
              <input type="submit" value="Submit" />
            </form>
          );
        }
      }
  }

  export default NameForm;