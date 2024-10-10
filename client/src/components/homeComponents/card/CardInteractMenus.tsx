import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InteractMenuModals from "../modals/InteractMenuModals";
import OrderNFTApparel from "../content/OrderNFTApparel";
import { NFTData } from "../../../utils/Types";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));

const CardInteractMenus:React.FC<{nftData:NFTData}> = ({nftData}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const open = Boolean(anchorEl);
  const [modalContent, setModalContent] = React.useState<{
    title: string;
    description: string;
    videoUrl: string;
    content: any;
    nftDetail: NFTData;
  }>({ title: "", description: "", videoUrl: "" ,content:"",nftDetail:{}});
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = (
    title: string,
    description: string,
    videoUrl: string,
    content: any,
    nftDetail: NFTData
  ) => {
    setModalContent({ title, description, videoUrl ,content,nftDetail});
    setOpenModal(true);
    setAnchorEl(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setAnchorEl(null);
  };

  const options = [
    {
      label: "Use A Buddy Earn TIM",
      title: "Use A Buddy Earn TIM",
      onClick: handleOpenModal,
      videoUrl: "https://youtu.be/ym1zJGAW3WE",
      nftDetail: nftData,
    },
    {
      label: "View Reputation",
      onClick: handleOpenModal,
      title: "View Reputation",
      description: "This feature is coming soon.",
    },
    {
      label: "Order This NFTs Apparel",
      onClick: handleOpenModal,
      title: "Gully Buddy Retail Ambassador Apparels",
      content: <OrderNFTApparel />
    },
  ];

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Interact
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {options.map((item, index) => {
          return (
            <MenuItem
              key={index}
              onClick={() =>
                handleOpenModal(item.title, item.description!, item.videoUrl!,item.content,item.nftDetail || {})
              }
            >
              {item.label}
            </MenuItem>
          );
        })}
      </StyledMenu>
      {/* Modal */}
      <InteractMenuModals
        open={openModal}
        onClose={handleCloseModal}
        modalContents={modalContent}
      />
    </div>
  );
}
export default CardInteractMenus;
