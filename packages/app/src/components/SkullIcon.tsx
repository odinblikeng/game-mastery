import SvgIcon from "@mui/material/SvgIcon";

export default function SkullIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12 2C7.58 2 4 5.58 4 10c0 2.76 1.34 5.2 3.4 6.72V20c0 .55.45 1 1 1h1.1c.55 0 1-.45 1-1v-1h1v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h1v1c0 .55.45 1 1 1h1.1c.55 0 1-.45 1-1v-3.28C18.66 15.2 20 12.76 20 10c0-4.42-3.58-8-8-8zm-2.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
    </SvgIcon>
  );
}
