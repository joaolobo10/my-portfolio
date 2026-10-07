"use client";

// Hero Parallax (Aceternity UI · npx shadcn@latest add @aceternity/hero-parallax),
// adaptado ao portfólio:
// - Ocupa a largura da tela (é a única peça fora da coluna); as bordas somem num fade.
// - O progresso é medido enquanto a seção atravessa a tela, sem os 300vh do original.
// - Cards com altura fixa e largura pela proporção de cada projeto.
// - Inclinação e deslocamentos menores que os do original, proporcionais aos cards.
// - Fileiras sem flex-row-reverse: a ordem visual é a mesma ordem do teclado.
// - Movimento reduzido: as fileiras ficam paradas, retas e visíveis.
import React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

export type ParallaxItem = {
  key: string;
  // largura / altura do card
  ratio: number;
  // Cópia decorativa que completa a fileira (fica fora da árvore de acessibilidade).
  clone: boolean;
};

type HeroParallaxProps<T extends ParallaxItem> = {
  rows: T[][];
  renderCard: (item: T) => React.ReactNode;
  label: string;
};

// Quanto cada fileira anda para o lado ao longo da passagem pela tela (px).
const SHIFT = 220;
const springConfig = { stiffness: 300, damping: 30 };

export function HeroParallax<T extends ParallaxItem>({
  rows,
  renderCard,
  label,
}: HeroParallaxProps<T>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [-SHIFT, SHIFT]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [SHIFT, -SHIFT]),
    springConfig
  );
  // A inclinação de entrada termina quando a seção chega na altura de leitura.
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0.05, 0.35], [15, 0]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0.05, 0.35], [8, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0.05, 0.35], [80, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0.05, 0.35], [0.2, 1]),
    springConfig
  );

  return (
    <div ref={ref} className="parallax" role="region" aria-label={label}>
      <motion.div
        className="parallax__stage"
        style={reduce ? undefined : { rotateX, rotateZ, translateY, opacity }}
      >
        {rows.map((row, i) => (
          <motion.ul
            key={i}
            className="parallax__row"
            style={
              reduce
                ? undefined
                : { x: i % 2 === 0 ? translateX : translateXReverse }
            }
          >
            {row.map((item) => (
              <ProductCard key={item.key} item={item}>
                {renderCard(item)}
              </ProductCard>
            ))}
          </motion.ul>
        ))}
      </motion.div>
    </div>
  );
}

export const ProductCard = ({
  item,
  children,
}: {
  item: ParallaxItem;
  children: React.ReactNode;
}) => {
  return (
    <li
      className="parallax__card"
      style={{ "--r": item.ratio } as React.CSSProperties}
      aria-hidden={item.clone || undefined}
    >
      {children}
    </li>
  );
};

