import React, { Component } from "react";
import MaterialTable from "material-table";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Axios from "axios";

const URL = "http://localhost:8080/api";

class CommandesPage extends Component {
  constructor(props) {
    super(props);
    const id = JSON.parse(localStorage.getItem("user")).id;
    this.state = {
      commandes: [],
      articles: [],
      id,
    };
  }

  componentDidMount() {
    Axios.get(URL + "/articles").then((response) => {
      console.log(JSON.stringify(response.data));
      this.setState({
        articles: response.data,
      });
    });

    Axios.get(URL + "/commandes")
      .then((response) => response.data)
      .then((response) => {
        this.setState({
          commandes: response,
        });
        console.log("COMMANDES" + JSON.stringify(response));
      });
  }

  render() {
    let i = 0;
    let cmp = 0;

    let comms = [];

    this.state.commandes.map((commande) => {
      let firstTime = true;
      let parentId;

      let commandesLine = commande.commandesLine.map((commandeLine) => {
        if (firstTime) {
          parentId = commande.id;
          firstTime = false;
          return {
            id: commande.id,
            number: ++i,
            client: commande.user.name + " " + commande.user.f_name,
            designation: commandeLine.article.designation,
            photo: commandeLine.article.photo,
            quantite: commandeLine.quantite,
            date: commande.datecommande.substring(0, 19),
          };
        } else {
          return {
            id: commande.id,
            number: ++i,
            client: commande.user.name + " " + commande.user.f_name,
            designation: commandeLine.article.designation,
            photo: commandeLine.article.photo,
            quantite: commandeLine.quantite,
            date: commande.datecommande.substring(0, 19),
            parentId,
          };
        }
      });

      comms.push(commandesLine);
    });
    comms = comms.flat(1);
    console.log(" FINALY " + JSON.stringify(comms));
    return (
      <div ref={this.wrapper}>
        <MaterialTable
          localization={{
            body: {
              editRow: {
                deleteText: "Voulez-vous vraiment supprimer cette ligne?",
              },
            },
          }}
          columns={[
            {
              title: "#",
              field: "id",
              type: "numeric",
              editable: "never",
              width: 50,
              hidden: true,
            },
            {
              title: "Numéro",
              field: "number",
              type: "numeric",
              editable: "never",
              width: 100,
            },
            {
              title: "Client",
              field: "client",
            },

            {
              title: "Désignation",
              field: "designation",
            },
            {
              title: "Image",
              field: "photo",
              render: (rowData) => (
                <img
                  src={`data:image/png;base64,${rowData.photo}`}
                  style={{ width: 100, borderRadius: "4%" }}
                />
              ),
            },
            {
              title: "Quantite",
              field: "quantite",
              type: "numeric",
            },
            {
              title: "Date",
              field: "date",
            },
          ]}
          data={comms}
          parentChildData={(row, rows) =>
            rows.find((a) => a.id === row.parentId)
          }
          options={{
            selection: true,
          }}
          title="Commandes"
        />
      </div>
    );
  }
}

export default CommandesPage;
