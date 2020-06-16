export interface Button {
  buttonName: string;
  icon?: {
    iconName?: string; // If using material icons font or pure text
    iconImgSrc?: string; // If the icon is an image
    iconImgAlt?: string; // If the icon is an image
    iconPack?: string; // Ionicons, Material Design icons...
  };
  styles?: {
    width?: string;
    height?: string;
    padding?: string;
    margin?: string;
    backgroundRgb?: string;
    backgroundAlpha?: number | string;
    border?: string;
    borderRadius?: string;
    fontSize?: string;
    fontColor?: string;
  };
}
