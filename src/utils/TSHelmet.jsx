import { Helmet } from "react-helmet-async";
const TSHelmet = ({ title }) => {
  return (
    <Helmet>
      <title>TS Survey - {title} </title>
    </Helmet>
  );
};

export default TSHelmet;
