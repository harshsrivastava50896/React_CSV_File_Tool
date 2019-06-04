import React, { Component } from "react";
import CSVReader from "react-csv-reader";
import _ from "lodash";
import "./App.css";
import Axios from "axios";
import Item from "./Models/Item";
import SimpleModal from "./ConfirmModal";
import LoadingOverlay from "react-loading-overlay";

class App extends Component {
  state = {
    items: [Item],
    updatedItems: [],
    header: [],
    open: false,
    activateModal: false,
    isActive: false
  };

  componentDidMount() {
    
    Axios.get("https://localhost:44308/api/values").then((response) => {
      this.setState({ isActive: true });
      var items = [Item];
      response.data.forEach(
        (x) => {
          var item = new Item();
          item.Id = x.id;
          item.Name = x.name;
          item.Description = x.description;

          items.push(item);
        },
        (items = items.filter((m) => m.Id !== undefined)),
        this.setState({ items }),
        this.setState({ isActive: false })
      );

      var header = _.keys(items[1]);
      this.setState({ header });
    });
  }

  handleSubmit = (files) => {
    var data = _.join(files, "\\r\\n");
    var updatedItems = [];
    Axios.post(
      "https://localhost:44308/api/values",
      '"' + data + '"',
      {
        headers: { "Content-Type": "application/json" }
      },
      this.setState({ isActive: true })
    ).then((resp) => {
      resp.data.forEach((x) => {
        updatedItems.push(x);
      });
      this.setState({ updatedItems });
      this.setState({ activateModal: true });
      this.setState({ open: true });
      this.setState({ isActive: false });
    });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  process = () => {
    Axios.put(
      "https://localhost:44308/api/values",
      this.state.updatedItems
    ).then((resp) => {
      var items = [Item];
      resp.data.forEach((x) => {
        var item = new Item();
        item.Id = x.id;
        item.Name = x.name;
        item.Description = x.description;

        items.push(item);
      });
      this.setState({ items, activateModal: false });
    });
  };

  removeItem = (item) => {
    var updatedItems = _.filter(this.state.updatedItems, (x) => {
      return x.product.id !== item.product.id;
    });
    this.setState({ updatedItems });
    if (this.state.updatedItems.length - 1 === 0) {
      this.setState({ open: false, activateModal: false });
    }
  };
  render = (props) => {
    return (
      <div>
        <LoadingOverlay
          fadeSpeed={900}
          active={this.state.isActive}
          spinner
          text="Loading your content...">
          <div className="import">
            <CSVReader
              cssClass="csv-reader-input"
              label="Import"
              onFileLoaded={this.handleSubmit}
              onError={this.handleDarkSideForce}
              inputId="ObiWan"
              inputStyle={{ color: "pink" }}
            />
          </div>
          <div id="resp-table">
            <div id="resp-table-caption">Products Table</div>
            <div id="resp-table-header">
              {this.state.header.map((x, i) => {
                return (
                  <div className="table-header-cell" key={i}>
                    {x}
                  </div>
                );
              })}
            </div>
            <div id="resp-table-body">
              {this.state.items.map((x, i) => {
                return (
                  <div className="resp-table-row" key={i}>
                    <div className="table-body-cell">{x.Id}</div>
                    <div className="table-body-cell">{x.Name}</div>
                    <div className="table-body-cell">{x.Description}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {this.state.activateModal ? (
            <SimpleModal
              headers={this.state.header}
              data={this.state.updatedItems}
              show={this.state.open}
              close={this.handleClose}
              remove={this.removeItem}
              processData={this.process}
            />
          ) : (
            <p />
          )}
        </LoadingOverlay>
      </div>
    );
  };
}

export default App;
