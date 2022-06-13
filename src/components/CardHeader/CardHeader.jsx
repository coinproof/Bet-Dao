import { Box } from "@material-ui/core";
import { tw } from "twind";
// import "./cardheader.scss";

const CardHeader = ({ title, children }) => {
  return (
    <Box className={`card-header`}>
      <p className={tw("text-[#BCBCBC] font-normal text-[11px]")}>{title}</p>

      {children}
    </Box>
  );
};

export default CardHeader;
