import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import ClassIcon from "@material-ui/icons/Class";
import PeopleIcon from "@material-ui/icons/People";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { Link } from "react-router-dom";

export const mainListItems = (
  <div>
    <ListItem
      button
      component={Link}
      to="/home/"
      onClick={e => {
        console.log("clicked");
        return false;
      }}
    >
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button component={Link} to="/home/categories">
      <ListItemIcon>
        <ClassIcon />
      </ListItemIcon>
      <ListItemText primary="Catégories" />
    </ListItem>
    <ListItem button component={Link} to="/home/commandes">
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Commandes" />
    </ListItem>
    <ListItem button component={Link} to="/home/users">
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Users" />
    </ListItem>
  </div>
);
