import { Loader } from "@react-three/drei";

export default function LoaderCustom() {
  return (
    <Loader
    containerStyles={{'background': '#040404'}}
    innerStyles={{'width': '38vw','height': '16px'}}
    barStyles={{'width': '38vw', 'height': '16px'}}
    dataStyles={{'fontSize': '20px'}}
    dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`}
    />
  )
} 