"use client";

import { FORM_HEIGHT_MM, FORM_WIDTH_MM } from "@/lib/attestation-layout";

/**
 * Reproduction vectorielle propre du Mod. G11 FR *17*
 * (remplace le scan photo — meilleure lisibilité à l'écran et en PDF).
 */
export function FormTemplateBackground() {
  const W = FORM_WIDTH_MM;
  const H = FORM_HEIGHT_MM;

  const dot = (x: number, y: number, w: number) => (
    <line
      x1={x}
      y1={y}
      x2={x + w}
      y2={y}
      stroke="#999"
      strokeWidth={0.15}
      strokeDasharray="1.2 0.8"
    />
  );

  const rows = Array.from({ length: 8 }, (_, i) => 17.5 + i * 3.1);

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        <rect width={W} height={H} fill="#faf8f2" />

        {/* Bandes perforées */}
        <rect x={0} y={0} width={14} height={H} fill="#f0ede6" />
        <rect x={W - 14} y={0} width={14} height={H} fill="#f0ede6" />
        {[8, 20, 32, 44, 56, 68, 80, 92].map((y) => (
          <g key={`hole-l-${y}`}>
            <circle cx={7} cy={(H * y) / 100} r={1.8} fill="#ddd" />
            <circle cx={W - 7} cy={(H * y) / 100} r={1.8} fill="#ddd" />
          </g>
        ))}

        {/* Marge gauche */}
        <text
          x={3}
          y={H * 0.5}
          fontSize={2.2}
          fill="#aaa"
          transform={`rotate(-90 3 ${H * 0.5})`}
          fontFamily="Arial, sans-serif"
        >
          MOD. G11 FR *17* — 05/17
        </text>

        {/* En-tête */}
        <text x={W * 0.2} y={H * 0.028} fontSize={2.2} fill="#666" fontFamily="Arial">
          COMPLETER CI-DESSOUS OU APPOSER UNE VIGNETTE DE L&apos;O.A.
        </text>
        <text x={W * 0.2} y={H * 0.042} fontSize={2} fill="#888" fontFamily="Arial">
          Nom et prénom du patient :
        </text>
        {dot(W * 0.52, H * 0.041, W * 0.42)}
        <text x={W * 0.2} y={H * 0.058} fontSize={2} fill="#888" fontFamily="Arial">
          Organisme assureur :
        </text>
        {dot(W * 0.48, H * 0.057, W * 0.46)}
        <text x={W * 0.2} y={H * 0.074} fontSize={2} fill="#888" fontFamily="Arial">
          NISS :
        </text>
        {dot(W * 0.3, H * 0.073, W * 0.22)}
        <text x={W * 0.56} y={H * 0.074} fontSize={2} fill="#888" fontFamily="Arial">
          Adresse du patient :
        </text>
        {dot(W * 0.72, H * 0.073, W * 0.22)}

        {/* Titre */}
        <text
          x={W * 0.5}
          y={H * 0.1}
          textAnchor="middle"
          fontSize={4}
          fontWeight="bold"
          fill="#222"
          fontFamily="Arial"
        >
          ATTESTATION DE SOINS DONNÉS
        </text>
        <rect
          x={W * 0.18}
          y={H * 0.105}
          width={W * 0.64}
          height={H * 0.022}
          fill="none"
          stroke="#333"
          strokeWidth={0.25}
        />
        <text
          x={W * 0.5}
          y={H * 0.118}
          textAnchor="middle"
          fontSize={2.2}
          fill="#444"
          fontFamily="Arial"
        >
          A COMPLETER PAR LE DISPENSATEUR
        </text>
        <text x={W * 0.2} y={H * 0.138} fontSize={2} fill="#888" fontFamily="Arial">
          Nom et prénom du patient :
        </text>
        {dot(W * 0.52, H * 0.137, W * 0.42)}

        {/* Tableau prestations */}
        <rect
          x={W * 0.08}
          y={H * 0.155}
          width={W * 0.84}
          height={H * 0.28}
          fill="none"
          stroke="#333"
          strokeWidth={0.3}
        />
        <line x1={W * 0.5} y1={H * 0.155} x2={W * 0.5} y2={H * 0.435} stroke="#333" strokeWidth={0.25} />
        <line x1={W * 0.08} y1={H * 0.168} x2={W * 0.92} y2={H * 0.168} stroke="#bbb" strokeWidth={0.15} />

        {[0, 1].map((half) => {
          const ox = half === 0 ? 0.1 : 0.52;
          return (
            <g key={half}>
              <text x={W * (ox + 0.02)} y={H * 0.166} fontSize={1.8} fill="#888" fontFamily="Arial">
                Date de la prestation
              </text>
              <text x={W * (ox + 0.2)} y={H * 0.166} fontSize={1.8} fill="#888" fontFamily="Arial">
                N° de nomenclature
              </text>
            </g>
          );
        })}

        {rows.map((pct, i) => (
          <line
            key={`row-${i}`}
            x1={W * 0.08}
            y1={(H * pct) / 100}
            x2={W * 0.92}
            y2={(H * pct) / 100}
            stroke="#ddd"
            strokeWidth={0.12}
          />
        ))}

        {/* Prescripteur */}
        <text x={W * 0.2} y={H * 0.57} fontSize={2} fill="#888" fontFamily="Arial">
          Prescrit par :
        </text>
        {dot(W * 0.38, H * 0.569, W * 0.24)}
        <text x={W * 0.64} y={H * 0.57} fontSize={2} fill="#888" fontFamily="Arial">
          en date du :
        </text>
        {dot(W * 0.76, H * 0.569, W * 0.14)}
        <text x={W * 0.2} y={H * 0.6} fontSize={2} fill="#888" fontFamily="Arial">
          Numéro d&apos;identification I.N.A.M.I. du/des prescripteur(s) :
        </text>
        {dot(W * 0.68, H * 0.599, W * 0.22)}

        {/* Dispensateur */}
        <rect
          x={W * 0.08}
          y={H * 0.64}
          width={W * 0.48}
          height={H * 0.1}
          fill="none"
          stroke="#333"
          strokeWidth={0.25}
        />
        <text x={W * 0.1} y={H * 0.655} fontSize={2} fill="#888" fontFamily="Arial">
          Identification du dispensateur
        </text>
        <rect
          x={W * 0.62}
          y={H * 0.64}
          width={W * 0.28}
          height={H * 0.1}
          fill="none"
          stroke="#333"
          strokeWidth={0.25}
        />
        <text x={W * 0.64} y={H * 0.655} fontSize={1.8} fill="#888" fontFamily="Arial">
          A.R. 15.07.2002
        </text>
        <text x={W * 0.64} y={H * 0.7} fontSize={2} fill="#888" fontFamily="Arial">
          EUR
        </text>
        {dot(W * 0.7, H * 0.695, W * 0.16)}

        <text x={W * 0.64} y={H * 0.725} fontSize={2} fill="#888" fontFamily="Arial">
          Date :
        </text>
        {dot(W * 0.72, H * 0.724, W * 0.14)}
        <text x={W * 0.64} y={H * 0.745} fontSize={2} fill="#888" fontFamily="Arial">
          Signature du dispensateur
        </text>

        {/* Perforation */}
        <line
          x1={W * 0.08}
          y1={H * 0.78}
          x2={W * 0.92}
          y2={H * 0.78}
          stroke="#5a9e5a"
          strokeWidth={0.2}
          strokeDasharray="2 1.5"
        />
        <text x={W * 0.5} y={H * 0.795} textAnchor="middle" fontSize={2} fill="#5a9e5a" fontFamily="Arial">
          REÇU
        </text>

        {/* Reçu */}
        <text x={W * 0.2} y={H * 0.82} fontSize={2} fill="#888" fontFamily="Arial">
          Perçu pour le compte du N° BCE :
        </text>
        {dot(W * 0.55, H * 0.819, W * 0.3)}
        <text x={W * 0.2} y={H * 0.86} fontSize={2} fill="#888" fontFamily="Arial">
          Reçu la somme de :
        </text>
        {dot(W * 0.42, H * 0.859, W * 0.35)}
        <text x={W * 0.8} y={H * 0.86} fontSize={2} fill="#888" fontFamily="Arial">
          EUR
        </text>
        <text x={W * 0.64} y={H * 0.9} fontSize={2} fill="#888" fontFamily="Arial">
          Date :
        </text>
        {dot(W * 0.72, H * 0.899, W * 0.14)}
      </svg>
    </div>
  );
}
