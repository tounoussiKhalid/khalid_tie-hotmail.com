import React from "react";

import Select from "react-select";
import { colourOptions } from "../docs/data";

class MultiSelect extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <Select
        isMulti
        defaultValue={this.props.defaultVal}
        name="roles"
        options={this.props.options}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={e => {
          console.log("CLICKED" + JSON.stringify(e));
        }}
      />
    );
  }
}

export default MultiSelect;
