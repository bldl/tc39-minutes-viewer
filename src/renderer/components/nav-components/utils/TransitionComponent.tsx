import { useSpring, animated } from "@react-spring/web";
import Collapse from "@mui/material/Collapse";
import { TransitionProps } from "@mui/material/transitions";

export const TransitionComponent = (props: TransitionProps) => {
  const style = useSpring({
    reset: true,
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
};
