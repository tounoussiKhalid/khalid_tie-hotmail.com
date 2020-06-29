import React, { Component } from "react";
import MaterialTable from "material-table";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Axios from "axios";

const URL = "http://localhost:8080/api";
class ArticlesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      categories: [],
      newArticle: {
        designation: "",
        prix: "",
        quantite: "",
        category: { id: "", category: "" },
      },
    };
  }

  componentDidMount() {
    console.log(" this is called");
    Axios.get(URL + "/articles").then((response) => {
      console.log(JSON.stringify(response.data));
      this.setState({
        articles: response.data,
      });
    });

    Axios.get(URL + "/categories").then((response) => {
      console.log(response);
      this.setState({
        categories: response.data,
      });
    });
  }

  async findCategory(newData) {
    let category = this.state.categories.find((cat) => {
      console.log("*" + JSON.stringify(cat));
      return cat["id"] == newData["category"];
    });
    newData["category"] = category;
    return newData;
  }

  async createEntity(newData) {
    newData = await this.findCategory(newData);

    const article = await Axios.post(URL + "/articles", newData, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      return resp["data"];
    });

    return article;
  }

  async updateEntity(newData) {
    newData = await this.findCategory(newData);

    console.log("NEW DATA " + JSON.stringify(newData["category"]));
    const article = await Axios.put(
      URL + "/articles/" + newData["id"],
      newData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((resp) => {
      console.log("RESPONSE " + JSON.stringify(resp));
      return resp["data"];
    });
    return article;
  }

  deleteEntity(id) {
    console.log(URL + "/articles/" + id);
    Axios.delete(URL + "/articles/" + id)
      .then((resp) => JSON.stringify)
      .then((resp) => {
        console.log(resp);
      });
  }

  render() {
    let i = 0;
    let categories = {};
    this.state.categories.map((category) => {
      categories[category["id"]] = category["category"];
    });
    console.log("->", categories);
    return (
      <div>
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
              title: "Désignation",
              field: "designation",
            },
            {
              title: "Image",
              field: "photo",
              render: (rowData) => (
                <img
                  src={`data:image/png;base64,${rowData.photo}`}
                  style={{ width: 100, borderRadius: "50%" }}
                />
              ),
            },
            {
              title: "Prix",
              field: "prix",
              type: "numeric",
            },
            {
              title: "Quantite",
              field: "quantite",
              type: "numeric",
            },
            {
              title: "Catégorie",
              field: "category",
              lookup: categories,
            },
          ]}
          data={this.state.articles.map((article) => {
            return {
              number: ++i,
              id: article["id"],
              designation: article["designation"],
              prix: article["prix"],
              quantite: article["quantite"],
              photo: article["photo"],
              category:
                article["category"] == null ? "" : article["category"]["id"],
            };
          })}
          options={{
            actionsColumnIndex: -1,
          }}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(async () => {
                  {
                    const data = this.state.articles;
                    await this.createEntity(newData).then((response) => {
                      data.push(response);
                    });
                    // this.createEntity(newData);
                    this.setState({ data }, () => resolve());
                  }
                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                console.log(newData);
                setTimeout(async () => {
                  {
                    const data = this.state.articles;
                    console.log("OLD DATA" + JSON.stringify(oldData));

                    await this.updateEntity(newData).then((resp) => {
                      console.log("UPDATE " + JSON.stringify(resp));
                      data.find((art, i) => {
                        if (art.id === oldData.id) {
                          data[i] = resp;
                          console.log("FOUND" + JSON.stringify(art));
                          return true;
                        }
                      });
                      this.setState({ data }, () => resolve());
                    });
                    console.log("AFTER UPDATE " + JSON.stringify(data));
                  }
                  resolve();
                }, 500);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    let data = this.state.articles;
                    const index = data.indexOf(oldData);
                    this.deleteEntity(oldData.id);
                    data.splice(index, 1);
                    this.setState({ data }, () => resolve());
                  }
                  resolve();
                }, 1000);
              }),
          }}
          title="Articles"
        />
      </div>
    );
  }
}

export default ArticlesPage;
