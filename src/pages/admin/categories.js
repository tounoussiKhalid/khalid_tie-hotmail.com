import React, { Component } from "react";
import MaterialTable from "material-table";
import Axios from "axios";

const URL = "http://localhost:8080/api";
class CategoriesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      categories: [],
      newCategorie: {
        category: "",
      },
    };
  }

  componentDidMount() {
    Axios.get(URL + "/categories").then((response) => {
      console.log(response);
      this.setState({
        categories: response.data,
      });
    });
  }

  async createEntity(newData) {
    const categorie = await Axios.post(URL + "/categories", newData, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      return resp["data"];
    });

    return categorie;
  }

  render() {
    let i = 0;
    let categories = {};

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
              title: "Catégorie",
              field: "category",
            },
          ]}
          data={this.state.categories.map((category) => {
            return {
              number: ++i,
              id: category["id"],
              category: category["category"],
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
                      this.setState({ data });
                    });
                    this.setState({ data }, () => resolve());
                  }
                  resolve();
                }, 1000);
              }),
          }}
          title="Categories"
        />
      </div>
    );
  }
}

export default CategoriesPage;
