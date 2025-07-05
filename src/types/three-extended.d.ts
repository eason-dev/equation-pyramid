import type { Object3DNode } from "@react-three/fiber";
import type { ShaderMaterial } from "three";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      trippyMaterial: Object3DNode<ShaderMaterial, typeof ShaderMaterial>;
    }
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    trippyMaterial: Object3DNode<ShaderMaterial, typeof ShaderMaterial>;
  }
}
