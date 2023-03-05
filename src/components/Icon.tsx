import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

interface Props extends Omit<FontAwesomeIconProps, "size"> {
  size?: number;
  color?: string;
}

export default function Icon({ size = 24, color, ...props }: Props) {
  return (
    <FontAwesomeIcon
      style={{ fontSize: size, width: size, height: size, color }}
      {...props}
    />
  );
}

export { Props as IconProps };
