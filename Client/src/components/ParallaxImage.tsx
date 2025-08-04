import {motion,useScroll,useTransform} from "framer-motion";
import {useRef} from "react";

interface Props{src:string;title:string;subtitle?:string;}

export default function ParallaxImage({src,title,subtitle}:Props){
  const ref=useRef<HTMLDivElement>(null);
  const {scrollYProgress}=useScroll({target:ref,offset:["start end","end start"]});
  const y=useTransform(scrollYProgress,[0,1],["-30%","30%"]);

  return(
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      <motion.img src={src} style={{y}} className="absolute inset-0 h-full w-full object-cover" alt={title}/>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-center text-white px-4">
        <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">{title}</h2>
        {subtitle && (
          <p className="mt-2 max-w-xl text-center text-white/90 text-base md:text-lg">{subtitle}</p>
        )}
      </div>

      <div className="absolute inset-0 bg-black/40"/>
    </section>
  );
}