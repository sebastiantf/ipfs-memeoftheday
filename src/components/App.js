import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buffer: null
    };
  }

  captureFile = event => {
    event.preventDefault();
    console.log("capturing file...");

    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      const buffer = Buffer(reader.result);
      this.setState({ buffer });
      console.log("file captured.");
      // console.log(this.state.buffer);
    };
  };
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#" target="_blank" rel="noopener noreferrer">
            Meme Of The Day
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img src="#" className="App-logo" alt="" />
                </a>
                <h1 className="header">Upload Meme</h1>
                  <input type="file" onChange={this.captureFile} />
                  <input type="submit" />
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
