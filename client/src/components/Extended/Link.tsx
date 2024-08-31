import { forwardRef } from "react";
import { Link, LinkProps, useLocation } from "react-router-dom";
import { clsx, isLinkActive } from "../../utils";

const ELink = forwardRef<
  HTMLAnchorElement,
  LinkProps & { activeClass?: string }
>((props, ref) => {
  const location = useLocation();
  const active = isLinkActive(location);
  return (
    <Link
      {...props}
      className={clsx([
        props.className,
        active(props.to.toString()) && `active-link ${props.activeClass || ""}`,
      ])}
      ref={ref}
    />
  );
});

export default ELink;
