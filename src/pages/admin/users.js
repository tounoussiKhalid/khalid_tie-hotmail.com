import React, { Component } from "react";
import MaterialTable from "material-table";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Axios from "axios";
import { MenuItem, OutlinedInput } from "@material-ui/core";
import MultiSelect from "../../components/MultiSelect";

const URL = "http://localhost:8080/api";
class UsersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      roles: [],
      newUser: {
        active: "",
        name: "",
        f_name: "",
        email: "",
        password: ""
      },
      selected: []
    };
  }

  componentDidMount() {
    console.log(" this is called");
    Axios.get(URL + "/users").then(response => {
      console.log(JSON.stringify(response.data));
      console.log(typeof response.data[0].roles);
      this.setState({
        users: response.data
      });
    });

    Axios.get(URL + "/roles").then(response => {
      console.log("ROLES :" + JSON.stringify(response.data));
      this.setState({
        roles: response.data
      });
    });
  }

  async createEntity(newData) {
    console.log(newData);
  }

  async updateEntity(newData) {
    newData = await this.findCategory(newData);

    console.log("NEW DATA " + JSON.stringify(newData["category"]));
    const article = await Axios.put(
      URL + "/articles/" + newData["id"],
      newData,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    ).then(resp => {
      console.log("RESPONSE " + JSON.stringify(resp));
      return resp["data"];
    });
    return article;
  }

  deleteEntity(id) {
    console.log(URL + "/articles/" + id);
    Axios.delete(URL + "/articles/" + id)
      .then(resp => JSON.stringify)
      .then(resp => {
        console.log(resp);
      });
  }

  handleSelectChange = e => {
    console.log(JSON.stringify(e));
    /*this.setState({
      selected: [].slice.call(e.target.selectedOptions).map(o => {
        return o.value;
      })
    });*/
  };

  render() {
    let i = 0;
    let roles = [];
    this.state.roles.map(role => {
      roles.push({ value: role["id"], label: role["description"] });
    });
    console.log("RENDER ROLES ** " + JSON.stringify(roles));
    return (
      <div ref={this.wrapper}>
        <MaterialTable
          ma
          columns={[
            {
              title: "#",
              field: "id",
              type: "numeric",
              editable: "never",
              width: 50,
              hidden: true
            },
            {
              title: "Numéro",
              field: "number",
              type: "numeric",
              editable: "never",
              width: 100
            },

            {
              title: "Nom",
              field: "name"
            },
            {
              title: "Prénom",
              field: "f_name"
            },
            {
              title: "email",
              field: "email"
            },
            {
              title: "password",
              field: "password",
              type: "password",
              hidden: true
            },
            {
              title: "rôles",
              field: "roles",
              editComponent: x => {
                console.log("DEFUALT VAL -> " + JSON.stringify(x.value));
                return (
                  <FormControl variant="outlined">
                    <MultiSelect defaultVal={x.value} options={roles} />
                  </FormControl>
                );
              },
              render: rowData => {
                console.log(JSON.stringify(rowData));
                console.log(
                  "THIS IS ROW DATA " +
                    JSON.stringify(rowData.roles.map(role => role["label"]))
                );
                return rowData.roles.map(role => role["label"]).join(",");
              }
            }
          ]}
          data={this.state.users.map(user => {
            let roles = [];
            user["roles"].map(role => {
              console.log("*" + JSON.stringify(role));
              roles.push({ value: role["id"], label: role["description"] });
            });
            console.log("USERS ROLES " + JSON.stringify(roles));
            return {
              number: ++i,
              id: user["id"],
              name: user["name"],
              f_name: user["f_name"],
              email: user["email"],
              password: user["password"],
              roles
            };
          })}
          options={{
            actionsColumnIndex: -1
          }}
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                  }
                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                console.log(newData);
                setTimeout(() => {
                  {
                  }
                  resolve();
                }, 500);
              }),
            onRowDelete: oldData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                  }
                  resolve();
                }, 1000);
              })
          }}
          title="Users"
        />
      </div>
    );
  }
}

export default UsersPage;
