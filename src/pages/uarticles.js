import React, { Component } from "react";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
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
        category: { id: "", category: "" }
      }
    };
  }

  componentDidMount() {
    console.log(" this is called");
    Axios.get(URL + "/articles").then(response => {
      console.log(JSON.stringify(response.data));
      this.setState({
        articles: response.data
      });
    });

    Axios.get(URL + "/categories").then(response => {
      console.log(response);
      this.setState({
        categories: response.data
      });
    });
  }

  async findCategory(newData) {
    let category = this.state.categories.find(cat => {
      console.log("*" + JSON.stringify(cat));
      return cat["id"] == newData["category"];
    });
    newData["category"] = category;
    return newData;
  }

  render() {
    let i = 0;
    let categories = {};
    this.state.categories.map(category => {
      categories[category["id"]] = category["category"];
    });
    console.log("->", categories);
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
              title: "Désignation",
              field: "designation"
            },
            {
              title: "Image",
              field: "photo",
              render: rowData => (
                <img
                  src={`data:image/png;base64,${rowData.photo}`}
                  style={{ width: 100, borderRadius: "50%" }}
                />
              )
            },

            {
              title: "Prix",
              field: "prix",
              type: "numeric"
            },
            {
              title: "Quantite",
              field: "quantite",
              type: "numeric"
            },
            {
              title: "Catégorie",
              field: "category",
              lookup: categories
            },
            {
              title: "Actions",
              field: "actions"
            }
          ]}
          data={this.state.articles.map(article => {
            return {
              number: ++i,
              id: article["id"],
              designation: article["designation"],
              prix: article["prix"],
              photo: article["photo"],
              quantite: article["quantite"],
              category:
                article["category"] == null ? "" : article["category"]["id"],
              actions: (
                <Button
                  variant="contained"
                  color="secondary"
                  endIcon={<ShoppingCartIcon />}
                >
                  Acheter
                </Button>
              )
            };
          })}
          options={{
            actionsColumnIndex: -1
          }}
          title="Articles"
        />
      </div>
    );
  }
}

export default ArticlesPage;
