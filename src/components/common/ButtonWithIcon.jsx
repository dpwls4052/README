import { Icon, IconButton } from "@chakra-ui/react";

const ButtonWithIcon = ({
  btnWidth,
  btnHeight,
  icon,
  iconWidth,
  iconHeight,
  ...props
}) => {
  return (
    <IconButton w={btnWidth} h={btnHeight} minW="0" {...props}>
      <Icon as={icon} w={iconWidth} h={iconHeight} />
    </IconButton>
  );
};

export default ButtonWithIcon;
