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
    this.selected = "";
    this.state = {
      users: [],
      roles: [],
      newUser: {
        active: "",
        name: "",
        f_name: "",
        email: "",
        password: "",
      },
      selected: "",
    };
  }

  fetchUsers() {
    Axios.get(URL + "/users").then((response) => {
      console.log(JSON.stringify(response.data));
      console.log(typeof response.data[0].roles);
      this.setState({
        users: response.data,
      });
    });
  }

  componentDidMount() {
    console.log(" this is called");
    Axios.get(URL + "/users").then((response) => {
      console.log(JSON.stringify(response.data));
      console.log(typeof response.data[0].roles);
      this.setState({
        users: response.data,
      });
    });

    Axios.get(URL + "/roles").then((response) => {
      console.log("ROLES :" + JSON.stringify(response.data));
      this.setState({
        roles: response.data,
      });
    });
  }

  async createEntity(newData) {
    const user = await Axios.post(URL + "/users", newData, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      return resp["data"];
    });

    return user;
  }

  async updateEntity(newData) {
    console.log("NEW DATA " + JSON.stringify(newData));
    const user = await Axios.put(URL + "/users/" + newData["id"], newData, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      console.log("RESPONSE " + JSON.stringify(resp));
      return resp["data"];
    });
    return user;
  }

  async deleteEntity(id) {
    console.log(URL + "/users/" + id);
    await Axios.delete(URL + "/users/" + id, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => JSON.stringify(resp))
      .then((resp) => {
        console.log(resp);
      });
    return;
  }

  handleSelectChange = (e) => {
    console.log("*************");
    console.log(JSON.stringify(e));
    console.log();
    if (e != null) this.selected = e[0];
    console.log(this.selected);
    console.log("HAKILI*************");
  };

  render() {
    let i = 0;
    let roles = [];
    this.state.roles.map((role) => {
      roles.push({ value: role["id"], label: role["description"] });
    });
    console.log("RENDER ROLES ** " + JSON.stringify(roles));
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
          ma
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
              title: "Nom",
              field: "name",
            },
            {
              title: "Prénom",
              field: "f_name",
            },
            {
              title: "email",
              field: "email",
            },
            {
              title: "password",
              field: "password",
              type: "password",
              hidden: true,
            },
            {
              title: "rôles",
              field: "roles",
              editComponent: (x) => {
                console.log("DEFUALT VAL -> " + JSON.stringify(x.value));
                return (
                  <FormControl variant="outlined">
                    <MultiSelect
                      onChange={this.handleSelectChange}
                      defaultVal={x.value}
                      options={roles}
                    />
                  </FormControl>
                );
              },
              render: (rowData) => {
                console.log(JSON.stringify(rowData));
                console.log(
                  "THIS IS ROW DATA " +
                    JSON.stringify(rowData.roles.map((role) => role["label"]))
                );
                return rowData.roles.map((role) => role["label"]).join(",");
              },
            },
          ]}
          data={this.state.users.map((user) => {
            let roles = [];

            console.log("*" + JSON.stringify(user["role"]));
            roles.push({
              value: user["role"]["id"],
              label: user["role"]["description"],
            });

            console.log("USERS ROLES " + JSON.stringify(roles));
            return {
              number: ++i,
              id: user["id"],
              name: user["name"],
              f_name: user["f_name"],
              email: user["email"],
              password: user["password"],
              roles,
            };
          })}
          options={{
            actionsColumnIndex: -1,
          }}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                newData["role"] = {
                  id: this.selected["value"],
                  description: this.selected["label"],
                };
                newData["password"] = "123456";
                setTimeout(() => {
                  {
                    let users = this.state.users;
                    this.createEntity(newData).then((response) => {
                      this.fetchUsers();
                    });
                  }
                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                newData["role"] = {
                  id: newData["roles"][0]["value"],
                  description: newData["roles"][0]["label"],
                };
                console.log("UPDATE !!!!!!!!" + JSON.stringify(newData));
                setTimeout(async () => {
                  {
                    const data = this.state.users;
                    await this.updateEntity(newData).then((response) =>
                      this.fetchUsers()
                    );
                  }
                  resolve();
                }, 500);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(async () => {
                  {
                    this.deleteEntity(oldData["id"]).then((resp) =>
                      this.fetchUsers()
                    );
                  }
                  resolve();
                }, 1000);
              }),
          }}
          title="Users"
        />
      </div>
    );
  }
}

export default UsersPage;
