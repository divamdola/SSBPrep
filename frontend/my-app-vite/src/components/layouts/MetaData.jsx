import React from "react";
import { Helmet} from "react-helmet-async";

const MetaData = ({ title }) => {
  return (
      <Helmet>
        <title>{`${title} - SSBPrep`}</title>
      </Helmet>
  );
};

export default MetaData; 